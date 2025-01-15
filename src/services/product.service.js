"use strict";

const { convertToObjectId } = require("../utils");
const { BAD_REQUEST } = require("../core/error.response.js");
const {
    getAllProducts,
    getProduct,
    createProduct,
    updateProduct,
    updateProducts,
    getProducts,
    searchProducts,
} = require("../repositories/product.repo");
const {
    productValidationSchema,
} = require("../validations/product.validation.js");
const { strictTransportSecurity } = require("helmet");

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

    static async getAllProductsByCategory({ limit, sort, page, category }) {
        const query = { isPublished: true, product_category: category };

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

    static async searchProductsByUser(keyword) {
        return await searchProducts(keyword);
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

    static async publishProuductForShop(product_id, userId) {
        const result = await updateProduct(
            {
                _id: product_id,
                isPublished: false,
                product_shop: convertToObjectId(userId),
            },
            { $set: { isPublished: true } },
        );

        if (result.modifiedCount === 0) {
            throw new BAD_REQUEST("Product not found or already published");
        }

        return result;
    }

    static async publishProudctsForShop(product_ids, userId) {
        const find = await getProducts({
            _id: { $in: product_ids },
            product_shop: convertToObjectId(userId),
        });

        if (find.length !== product_ids.length || !find) {
            throw new BAD_REQUEST("Some products not found");
        }

        const result = await updateProducts(
            {
                _id: { $in: product_ids },
                isPublished: false,
                product_shop: convertToObjectId(userId),
            },
            { $set: { isPublished: true } },
        );

        if (result.modifiedCount === 0) {
            throw new BAD_REQUEST("Products not found or already published");
        }

        return result;
    }

    static async draftProductForShop(product_id, userId) {
        const result = await updateProduct(
            {
                _id: product_id,
                isPublished: true,
                product_shop: convertToObjectId(userId),
            },
            { $set: { isPublished: false } },
        );

        if (result.modifiedCount === 0) {
            throw new BAD_REQUEST("Product not found or already drafted");
        }

        return result;
    }

    static async draftProductsForShop(product_ids, userId) {
        const find = await getProducts({
            _id: { $in: product_ids },
            product_shop: convertToObjectId(userId),
        });

        if (find.length !== product_ids.length || !find) {
            throw new BAD_REQUEST("Some products not found");
        }

        const result = await updateProducts(
            {
                _id: { $in: product_ids },
                isPublished: true,
                product_shop: convertToObjectId(userId),
            },

            { $set: { isPublished: false } },
        );

        if (result.modifiedCount === 0) {
            throw new BAD_REQUEST("Products not found or already drafted");
        }

        return result;
    }
}

module.exports = ProductService;
