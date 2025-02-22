"use strict";

const { getCart } = require("../repositories/cart.repo");
const { convertToObjectId } = require("../utils");
const { BAD_REQUEST } = require("../core/error.response.js");
const { getProduct, getProducts } = require("../repositories/product.repo.js");
const checkExistingProduct = require("../helper/checkExistingProduct.js");
const checkProductAvailability = require("../helper/checkProductAvailability.js");
const { getDiscountAmount } = require("./discount.service.js");
const { acquireLock } = require("./redis.service.js");
const { createOrder } = require("../repositories/order.repository.js");

class CheckoutService {
    /**
     * Handles checkout review process.
     *
     * @param {string} userId - The ID of the user initiating the checkout.
     * @param {Object} payload - The payload containing checkout details.
     * @param {string} [payload.couponCode] - The coupon code applied (if any).
     * @param {Array} payload.items - List of items in the cart.
     * @param {string} payload.items[].product_id - The ID of the product.
     * @param {number} payload.items[].price - The price of the product.
     * @param {number} payload.items[].quantity - The quantity of the product.
     *
     * @throws {BAD_REQUEST} If the cart is not found, an invalid request is made, or products are invalid.
     *
     * @returns {Promise<{checkoutOrder: Object, newItems: Array}>} The checkout order summary and validated items.
     */
    static async checkoutReview(userId, payload) {
        // Validate
        const foundCart = await getCart({
            cart_user_id: convertToObjectId(userId),
        });

        if (!foundCart) throw new BAD_REQUEST("Cart not found");

        // Check if the products exists in the cart and if the quantity match
        const { couponCode, items } = payload;
        items.forEach((item) => {
            const foundProduct = foundCart.cart_items.find(
                (cartItem) =>
                    cartItem.product_id.toString() === item.product_id,
            );

            if (!foundCart || foundProduct.quantity !== item.quantity)
                throw new BAD_REQUEST("Invalid request");
        });

        // Check if the product exist in database
        if (!(await checkExistingProduct(items)))
            throw new BAD_REQUEST("Invalid product");

        const checkoutOrder = {
                totalPrice: 0,
                feeShip: 0,
                totalDiscount: 0,
                totalCheckout: 0,
            },
            newItems = [];

        // check product availability
        await checkProductAvailability(items);

        // Total bill
        for (let i = 0; i < items.length; i++) {
            const { product_id, price, quantity } = items[i];

            const total = price * quantity;
            checkoutOrder.totalPrice += total;
            newItems.push({
                product_id: convertToObjectId(product_id),
                price,
                quantity,
                total,
            });
        }

        checkoutOrder.totalDiscount = await getDiscountAmount(
            userId,
            couponCode,
            checkoutOrder.totalPrice,
        );

        checkoutOrder.totalCheckout = check;
        return {
            checkoutOrder,
            newItems,
        };
    }

    static async orderByUser(userId, body) {
        const { user_address, user_payment, cartItems } = body;
        const { newItems, checkoutOrder } = await this.checkoutReview(
            userId,
            cartItems,
        );

        const products = cartItems.items;
        const cartId = await getCart({
            cart_user_id: convertToObjectId(userId),
        });

        const acquireProducts = [];
        for (let i = 0; i < products.length; i++) {
            const { product_id, quantity } = products[i];
            const keyLock = await acquireLock(product_id, quantity, cartId);
            acquireProducts.push(keyLock ? true : false);

            if (keyLock) {
                await releaseLock(keyLock);
            }
        }

        // Check if a product is out of stock
        if (acquireProducts.includes(false)) {
            throw new BAD_REQUEST("Product out of stock");
        }

        return await createOrder({
            order_user_id: convertToObjectId(userId),
            order_checkout: checkoutOrder,
            order_shipping: user_address,
            order_payment: user_payment,
            order_products: newItems,
        });
    }
}

module.exports = CheckoutService;
