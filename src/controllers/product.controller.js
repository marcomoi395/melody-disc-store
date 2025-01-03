"use strict";

const { SuccessResponse } = require("../core/success.response");
const {
    getAllProducts,
    getProduct,
    createProductByAdmin,
} = require("../services/product.service");

class ProductController {
    getAllProducts = async (req, res) => {
        new SuccessResponse({
            message: "Get all products successfully",
            metadata: await getAllProducts(req.query),
        }).send(res);
    };

    getProduct = async (req, res) => {
        new SuccessResponse({
            message: "Get product successfully",
            metadata: await getProduct(req.params.product_id),
        }).send(res);
    };

    createProduct = async (req, res) => {
        new SuccessResponse({
            message: "Create product successfully",
            metadata: await createProductByAdmin(req.body, req.user.userId),
        }).send(res);
    };
}

module.exports = new ProductController();
