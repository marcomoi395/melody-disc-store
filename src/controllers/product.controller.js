"use strict";

const { SuccessResponse } = require("../core/success.response");
const {
    getAllProducts,
    getProduct,
    createProductByShop,
    getAllProductsByCategory,
    searchProductsByUser,
    publishProuductForShop,
    draftProductForShop,
    changeStatusProducts,
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

    getProductsByCategory = async (req, res) => {
        new SuccessResponse({
            message: "Get product successfully",
            metadata: await getAllProductsByCategory(req.params.category),
        }).send(res);
    };

    searchProductsByUser = async (req, res) => {
        new SuccessResponse({
            message: "Search product successfully",
            metadata: await searchProductsByUser(req.query.search),
        }).send(res);
    };

    publishProductForShop = async (req, res) => {
        new SuccessResponse({
            message: "Publish product successfully",
            metadata: await publishProuductForShop(
                req.params.product_id,
                req.user.userId,
            ),
        }).send(res);
    };

    draftProductForShop = async (req, res) => {
        new SuccessResponse({
            message: "Draft product successfully",
            metadata: await draftProductForShop(
                req.params.product_id,
                req.user.userId,
            ),
        }).send(res);
    };

    changeStatusProducts = async (req, res) => {
        new SuccessResponse({
            message: "Get products successfully",
            metadata: await changeStatusProducts(req.body, req.user.userId),
        }).send(res);
    };

    createProduct = async (req, res) => {
        new SuccessResponse({
            message: "Create product successfully",
            metadata: await createProductByShop(req.body, req.user.userId),
        }).send(res);
    };
}

module.exports = new ProductController();
