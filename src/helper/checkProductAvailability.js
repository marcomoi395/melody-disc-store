"use strict";

const {
    getInventorys,
    getInventorysWithProductInfo,
} = require("../repositories/inventory.repo");

module.exports = async (items) => {
    const foundInventories = await getInventorysWithProductInfo(
        items.map((item) => item.product_id),
    );

    console.log("foundInventory::", foundInventory);

    items.forEach((item) => {
        const foundInventory = foundInventories.find(
            (i) =>
                i.inventory_product_id.toString() ===
                item.product_id.toString(),
        );

        if (!foundInventory) {
            throw new Error(`${foundInventory.product_name} is out of stock`);
        }

        if (foundInventory.inventory_stock < item.quantity) {
            throw new Error(
                `${foundInventory.product_name} has only ${foundInventory.inventory_stock} left in stock`,
            );
        }
    });
};
