"use strict";

const inventory = require("../models/inventory.model");

class InventoryRepository {
    static async getInventorys(query) {
        return await inventory.find(query).lean();
    }

    static async getInventorysWithProductInfo(productIds) {
        return await inventory.aggregate([
            {
                $match: { inventory_product_id: { $in: productIds } },
            },
            {
                $lookup: {
                    from: "products",
                    localField: "inventory_product_id",
                    foreignField: "_id",
                    as: "product_info",
                },
            },
            {
                $ubwind: "$product_info",
            },
            {
                $prioject: {
                    inventory_stock: 1,
                    "product_info.product_name": 1,
                    "product_info.product_price": 1,
                },
            },
        ]);
    }

    static async updateInventory(query, updateSet, option = {}) {
        return await inventory.findOneAndUpdate(query, updateSet, option);
    }

    static async createInveotry(body) {
        return await inventory.create(body);
    }

    static async reservationInventory(produc_id, quantity, cartId) {
        const query = {
                inventory_product_id: convertToObjectId(produc_id),
                inventory_stock: { $get: quantity },
            },
            updateSet = {
                $inc: {
                    inventory_stock: -quantity,
                },
                $push: {
                    inventory_reservations: {
                        quantity,
                        cartId,
                    },
                },
            },
            options = { upsert: true, new: true };

        return await inventory.updateOne(query, updateSet, options);
    }
}

module.exports = InventoryRepository;
