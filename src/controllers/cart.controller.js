"use strict";

const { SuccessResponse, Created } = require("../core/success.response");
const {
    addProductToCart,
    changeQuantityProductInCart,
    getCart,
    deleteProductFromCart,
} = require("../services/cart.service");

class CartController {
    addProductToCart = async (req, res) => {
        new SuccessResponse({
            message: "Add product to cart successfully",
            metadata: await addProductToCart(req.user.userId, req.body),
        }).send(res);
    };

    changeQuantityProductInCart = async (req, res) => {
        new SuccessResponse({
            message: "Update quaity of product in cart successfully",
            metadata: await changeQuantityProductInCart(
                req.user.userId,
                req.body,
            ),
        }).send(res);
    };

    deleteProductFromCart = async (req, res) => {
        new SuccessResponse({
            message: "Delete product from cart successfully",
            metadata: await deleteProductFromCart(req.user.userId, req.body),
        }).send(res);
    };

    getCartForUser = async (req, res) => {
        new SuccessResponse({
            message: "Get cart for user successfully",
            metadata: await getCart(req.user.userId),
        }).send(res);
    };
}

module.exports = new CartController();
