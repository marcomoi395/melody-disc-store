const product = require("../models/product.models.js");

class ProductRepository {
    static async getAllProducts(
        page = 1,
        limit = 8,
        sort = { product_popularity: -1 },
        query = {},
    ) {
        page = Math.max(1, page);
        limit = Math.max(1, limit);
        const skip = (page - 1) * limit;

        return await product
            .find(query)
            .limit(limit)
            .skip(skip)
            .sort(sort)
            .lean();
    }

    static async getProduct(query) {
        return await product.findOne(query).lean();
    }

    static async getProducts(query) {
        return await product.find(query).lean();
    }

    static async createProduct(data) {
        return await product.create(data);
    }
}

module.exports = ProductRepository;
