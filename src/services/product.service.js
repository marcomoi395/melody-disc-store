"use strict";

const { convertToObjectId } = require("../utils");
const { BAD_REQUEST } = require("../core/error.response.js");
const {
    getAllProducts,
    getProduct,
    createProduct,
} = require("../repositories/product.repo");
const productValidationSchema = require("../validations/product.validation.js");

class ProductService {
    // -- User --
    async getAllProducts({ limit, sort, page }) {
        const query = { isPublished: true };

        return await getAllProducts(query, {
            limit,
            sort,
            page,
        });
    }

    async getProduct(product_id) {
        const query = { _id: product_id, isPublished: true };
        const foundProduct = await getProduct(query);
        if (!foundProduct) {
            throw new BAD_REQUEST("Product not found");
        }

        return foundProduct;
    }

    // Admin
    async createProductByAdmin(body, shopId) {
        const { error } = productValidationSchema.validate(body);
        if (error) throw new BAD_REQUEST(error.message);

        const data = {
            ...body,
            products_shop: convertToObjectId(shopId),
        };

        return await createProduct(data);
    }
}

module.exports = ProductService;
