"use strict";

const {
    getCart,
    createCart,
    updateCartAndReturn,
    updateCart,
} = require("../repositories/cart.repo");
const { getProducts, getProduct } = require("../repositories/product.repo");
const { BAD_REQUEST } = require("../core/error.response.js");
const { convertToObjectId } = require("../utils");
const checkExistingProduct = require("../helper/checkExistingProduct.js");
const {
    addProductToCartSchema,
    changeQuantityProductInCartSchema,
} = require("../validations/cart.validate.js");
const {
    changeStatusProductsSchema,
} = require("../validations/product.validation.js");

class CartService {
    /**
     * Add a product to the user's cart.
     * @async
     * @param {string} userId
     * @param {Object} products - The product detail to addProductToCart
     * @returns {Promise<Object>} The success message
     * @throws {BAD_REQUEST} If product don't exists in database or user's cart locked
     */

    static async addProductToCart(userId, products = {}) {
        // Validate product
        const { error, value } = addProductToCartSchema.validate(products, {
            stripUnknown: true,
        });
        if (error) throw new BAD_REQUEST(error.message);

        if (!(await checkExistingProduct([value])))
            throw new BAD_REQUEST("Invalid product");

        // Check cart exists
        const foundCart = await getCart({
            cart_user_id: convertToObjectId(userId),
        });

        if (!foundCart) {
            // Create new cart
            return await createCart({
                cart_user_id: convertToObjectId(userId),
                cart_products: [value],
            });
        }

        if (foundCart.cart_state === "inactive") {
            throw new BAD_REQUEST("Your cart is locked");
        }

        // If product already exists in cart
        if (
            foundCart.cart_products.some(
                (item) => item.product_id === value.product_id,
            )
        ) {
            const response = await updateCart(
                {
                    cart_user_id: convertToObjectId(userId),
                    cart_state: "active",
                    "cart_products.product_id": value.product_id,
                },
                {
                    $inc: { "cart_products.$.quantity": value.quantity },
                },
            );

            if (response.modifiedCount === 1)
                return "Product added to cart successfully";
        }

        // If there is a shopping cart but no product
        if (foundCart.cart_products && foundCart.cart_products.length === 0) {
            return await updateCartAndReturn(
                {
                    cart_user_id: convertToObjectId(userId),
                    cart_state: "active",
                },
                {
                    $push: {
                        cart_products: value,
                    },
                },
            );
        }
    }

    /**
     * Increase or decrease the quantity of a product in the user's cart
     * @async
     * @param {string} userId
     * @param {Object} body - The product detail to changeQuantityProductInCart
     * @returns {Promise<Object>} Returns new user's cart
     * @throws {BAD_REQUEST} If product don't exists in database or user's cart locked
     */

    static async changeQuantityProductInCart(userId, body = {}) {
        const { error, value } = changeQuantityProductInCartSchema.validate(
            body,
            {
                stripUnknown: true,
            },
        );
        if (error) throw new BAD_REQUEST(error.message);

        const { product_id, quantity, old_quantity, price } = value;

        // Check product exist in cart
        const foundProductInCart = await getCart({
            cart_user_id: convertToObjectId(userId),
            cart_state: "active",
            "cart_products.product_id": product_id,
        });

        if (!foundProductInCart) throw new BAD_REQUEST("Invalid request");
        if (foundProductInCart.cart_products[0].quantity != old_quantity)
            throw new BAD_REQUEST("Invalid request");

        const foundProduct = await getProduct({
            _id: product_id,
            isPublished: true,
        });

        if (!foundProduct) throw new BAD_REQUEST("Invalid product");
        if (foundProduct.product_price !== price)
            throw new BAD_REQUEST("Invalid product");

        if (quantity <= 0) {
            // delete product from cart
            return await updateCartAndReturn(
                {
                    cart_user_id: convertToObjectId(userId),
                    cart_state: "active",
                },
                {
                    $pull: {
                        cart_products: { product_id },
                    },
                },
            );
        }

        return await updateCartAndReturn(
            {
                cart_user_id: convertToObjectId(userId),
                cart_state: "active",
                "cart_products.product_id": product_id,
            },
            {
                $inc: {
                    "cart_products.$.quantity": quantity - old_quantity,
                },
            },
        );
    }

    /**
     * Delete products in user's cart
     * @async
     * @param {string} userId - The ID off the user
     * @param {array} productIdArray - The product detail to deleteProductFromCart
     * @return {Promise<Object>} Return new user's cart
     * @throws {BAD_REQUEST} If product don't find in user's cart
     */

    static async deleteProductFromCart(userId, productIdArray) {
        // Check product exist in cart
        const foundProductInCart = await getCart({
            cart_user_id: convertToObjectId(userId),
            cart_state: "active",
            "cart_products.product_id": { $in: productIdArray },
        });

        if (!foundProductInCart) throw new BAD_REQUEST("Invalid request");

        return await updateCartAndReturn(
            {
                cart_user_id: convertToObjectId(userId),
                cart_state: "active",
            },
            {
                $pull: {
                    cart_products: { product_id: { $in: productIdArray } },
                },
            },
        );
    }

    /**
     * Retrieves the user's cart.
     * @async
     * @param {string} userId - The ID of the user.
     * @returns {Promise<Object>} The user's cart.
     * @throws {BAD_REQUEST} If the cart is locked.
     */

    static async getCart(userId) {
        const foundCart = await getCart({
            cart_user_id: convertToObjectId(userId),
        });

        if (!foundCart) {
            return await createCart({
                cart_user_id: convertToObjectId(userId),
            });
        }

        if (foundCart.cart_state === "inactive")
            throw new BAD_REQUEST("Your cart is locked");

        if (foundCart.cart_products.length === 0) return foundCart;

        const productIdArray = foundCart.cart_products.map(
            (item) => item.product_id,
        );
        if (productIdArray.length === 0) return foundCart;

        const foundProducts = await getProducts(
            {
                _id: { $in: productIdArray },
                isPublished: true,
            },
            (select = [
                "product_name",
                "product_price",
                "product_thumbnail",
                "product_artist_name",
            ]),
        );

        let cart = {
            cartId: foundCart._id,
            userId: foundCart.cart_user_id,
            items: [],
        };

        foundCart.cart_products.forEach((c) => {
            let item = {};
            let foundProduct = foundProducts.find(
                (x) => x._id.toString() === c.product_id.toString(),
            );

            item.name = foundProduct.product_name;
            if (c.price !== foundProducts.product_price) {
                item.originalPrice = c.price;
                item.isChangedPrice = true;
            }
            item.currentPrice = foundProducts.product_price;
            item.originalPrice = cart.price;
            item.currentPrice = foundProduct.product_price;
            item.thumbnail = foundProduct.product_thumbnail;
            item.artistName = foundProduct.product_artist_name;

            cart.items.push(item);
        });
        return cart;
    }
}

module.exports = CartService;
