"use strict";

const order = require("../models/order.model");

class OrderRepository {
    static async createOrder(body) {
        return await order.create(body);
    }
}

module.exports = OrderRepository;
