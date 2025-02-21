"use strict";

const { SuccessResponse, Created } = require("../core/success.response");
const {
    createDiscount,
    updateDiscount,
    getAllDiscountsForShop,
    getDiscountAmount,
    deleteDiscountForShop,
    changeStatusDiscount,
} = require("../services/discount.service");

class DiscountController {
    createDiscount = async (req, res) => {
        new Created({
            message: "Create discount successfully",
            metadata: await createDiscount(req.body),
        }).send(res);
    };

    updateDiscount = async (req, res) => {
        new SuccessResponse({
            message: "Update discount successfully",
            metadata: await updateDiscount(req.body, req.params.discountId),
        }).send(res);
    };

    getAllDiscountForShop = async (req, res) => {
        new SuccessResponse({
            message: "Get all discount for shop",
            metadata: await getAllDiscountsForShop(),
        }).send(res);
    };

    deleteDiscountForShop = async (req, res) => {
        new SuccessResponse({
            message: "Delete discount for shop",
            metadata: await deleteDiscountForShop(req.params.discountId),
        }).send(res);
    };

    changeStatusDiscount = async (req, res) => {
        new SuccessResponse({
            message: "Change status discount",
            metadata: await changeStatusDiscount(req.body),
        }).send(res);
    };
}

module.exports = new DiscountController();
