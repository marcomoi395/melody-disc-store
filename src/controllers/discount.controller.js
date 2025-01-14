"use strict";

const { SuccessResponse, Created } = require("../core/success.response");
const { createDiscount } = require("../services/discount.service");

class DiscountController {
    createDiscount = async (req, res) => {
        new Created({
            message: "Sucuessfully registered for client",
            metadata: await createDiscount(req.body, req.user.userId),
        }).send(res);
    };
}

module.exports = new DiscountController();
