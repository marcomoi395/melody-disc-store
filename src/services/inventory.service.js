"use strict";

const { getProduct } = require("../repositories/product.repo");
const { BAD_REQUEST } = require("../core/error.response.js");
const { updateInventory } = require("../repositories/inventory.repo.js");
const { convertToObjectId } = require("../utils/index.js");

class InventoryService {
    static async addStockToInventory({
        inventory_stock,
        inventory_product_id,
    }) {
        const product = await getProduct({ _id: inventory_product_id });

        if (!product) {
            throw new BAD_REQUEST("Product not found");
        }

        return await updateInventory(
            {
                inventory_product_id: convertToObjectId(inventory_product_id),
            },
            {
                $inc: {
                    inventory_stock: inventory_stock,
                },
            },
            {
                upsert: true,
                new: true,
            },
        );
    }
}

module.exports = InventoryService;
