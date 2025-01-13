"use strict";

const discount = require("../models/discount.model");

class DiscountRepository {
    static async createDiscount(data) {
        return await discount.create(data);
    }

    static async findByCode(code) {
        return await discount.find({ discount_code: code });
    }
}

module.exports = DiscountRepository;
