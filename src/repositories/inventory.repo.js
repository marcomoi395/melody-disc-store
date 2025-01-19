"use strict";

const inventory = require("../models/inventory.model");

class InventoryRepository {
    static async updateInventory(query, updateSet, option = {}) {
        return await inventory.findOneAndUpdate(query, updateSet, option);
    }

    static createInveotry(body) {
        return inventory.create(body);
    }
}

module.exports = InventoryRepository;
