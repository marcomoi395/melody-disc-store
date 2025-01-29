"use strict";

const {
    getCart,
    createCart,
    updateCartAndReturn,
} = require("../repositories/cart.repo");
const { getProducts } = require("../repositories/product.repo");
const { BAD_REQUEST } = require("../core/error.response.js");
const { convertToObjectId } = require("../utils");

class CartService {
    static async addProductToCart(userId, products = {}) {
        // Check cart exists
        const foundCart = await getCart({
            cart_user_id: convertToObjectId(userId),
        });

        if (!foundCart) {
            // Create new cart
            return await createCart({
                cart_user_id: convertToObjectId(userId),
                cart_products: products,
            });
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
                        cart_products: products,
                    },
                },
            );
        }
    }

    static async changeQuantityProductInCart(userId, body = {}) {
        const { product_id, quantity, old_quantity } = body;

        // Check product exist
        const foundProduct = await findProduct({ _id: product_id });

        if (!foundProduct) throw new BAD_REQUEST("Invalid product");

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
                    "cart.products.$.quantity": quantity - old_quantity,
                },
            },
        );
    }

    static async deleteProductFromCart(userId, product_id) {
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

    static async getCart(userId) {
        const foundCart = await getCart({ userId });
        if (!foundCart) throw new BAD_REQUEST("Invalid request");

        const productIdArray = foundCart.cart_products.map(
            (item) => item.product_id,
        );
        if (productIdArray.length === 0) return foundCart;

        const foundProducts = await getProducts({
            _id: { $in: productIdArray },
            isPublished: true,
        });

        // Add price
        foundCart.forEach((item) => {
            const product = foundProducts.find(
                (product) => product._id.toString === item.product_id,
            );

            item.product_price = product.price;

            if (product.product_quantity === 0) item.product_in_stock = false;
        });

        console.log("cart::", foundCart);

        return foundCart;
    }
}

module.export = CartService;
