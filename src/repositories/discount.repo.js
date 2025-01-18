"use strict";

const discount = require("../models/discount.model");

class DiscountRepository {
    static async createDiscount(data) {
        return await discount.create(data);
    }

    static async getDiscount(query) {
        return await discount.findOne(query).lean();
    }

    static async getDiscounts(query) {
        return await discount.find(query).lean();
    }

    static async updateDiscountAndReturn(query, updateSet) {
        return await discount.findOneAndUpdate(query, updateSet, { new: true });
    }

    static async deleteDiscount(query) {
        return await discount.deleteOne(query);
    }

    static async updateDiscount(query, updateSet) {
        return await discount.updateMany(query, updateSet);
    }
}

module.exports = DiscountRepository;
