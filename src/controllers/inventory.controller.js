"use strict";

const { SuccessResponse, Created } = require("../core/success.response");
const { addStockToInventory } = require("../services/inventory.service");

class AccessController {
    addStockToInventory = async (req, res) => {
        new SuccessResponse({
            message: "Stock added to inventory",
            metadata: await addStockToInventory(req.body),
        }).send(res);
    };
}

module.exports = new AccessController();
