"use strict";

const cart = require("../models/cart.model");

class CartRepository {
    static async getCart(query) {
        return await cart.findOne(query).lean();
    }

    static async createCart(body) {
        return await cart.create(body);
    }

    static async updateCart(query, updateSet, options = { new: true }) {
        return await cart.updateOne(query, updateSet, options);
    }

    static async updateCartAndReturn(
        query,
        updateSet,
        options = { new: true },
    ) {
        return await cart.findOneAndUpdate(query, updateSet, options);
    }
}

module.exports = CartRepository;
