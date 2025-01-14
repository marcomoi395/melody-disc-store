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
    static async getAllProducts({ limit, sort, page }) {
        const query = { isPublished: true };

        return await getAllProducts(query, {
            limit,
            sort,
            page,
        });
    }

    static async getProduct(product_id) {
        const query = { _id: product_id, isPublished: true };
        const foundProduct = await getProduct(query);
        if (!foundProduct) {
            throw new BAD_REQUEST("Product not found");
        }

        return foundProduct;
    }

    // Admin
    static async createProductByShop(body, shopId) {
        const { error, value } = productValidationSchema.validate(body, {
            stripUnknown: true,
        });

        if (error) throw new BAD_REQUEST(error.message);

        const data = {
            ...value,
            product_shop: convertToObjectId(shopId),
        };

        return await createProduct(data);
    }
}

module.exports = ProductService;
