const product = require("../models/product.models.js");
const { BAD_REQUEST } = require("../core/error.response.js");

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

    static async updateProduct(query, updateSet) {
        return await product.updateOne(query, updateSet);
    }

    static async updateProducts(query, updateSet) {
        return await product.updateMany(query, updateSet);
    }

    static async searchProducts(keyword) {
        const regexSearch = new RegExp(keyword);
        const result = await product
            .find(
                {
                    isPublished: true,
                    $text: { $search: regexSearch },
                },
                {
                    score: { $meta: "textScore" },
                },
            )
            .sort({ score: { $meta: "textScore" } })
            .lean();

        return result;
    }

    static async findOneAndUpdate(query, updateSet) {
        return product.findOneAndUpdate(query, updateSet, { new: true });
    }
}

module.exports = ProductRepository;
