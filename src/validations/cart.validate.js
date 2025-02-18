"use strict";

const Joi = require("joi");

const addProductToCartSchema = Joi.object({
    product_id: Joi.string().length(24).required(), // Đảm bảo product_id là chuỗi 24 ký tự (MongoDB ObjectId)
    quantity: Joi.number().integer().min(1).required(), // Đảm bảo quantity là số nguyên >= 1
    price: Joi.number().min(0).required(), // Đảm bảo price là số >= 0
});

const changeQuantityProductInCartSchema = Joi.object({
    product_id: Joi.string().length(24).required(), // Đảm bảo product_id là chuỗi 24 ký tự (MongoDB ObjectId)
    quantity: Joi.number().integer().required(), // Đảm bảo quantity là số nguyên >= 1
    old_quantity: Joi.number().integer().required(), // Đảm bảo quantity là số nguyên >= 1
    price: Joi.number().min(0).required(), // Đảm bảo price là số >= 0
});

module.exports = { addProductToCartSchema, changeQuantityProductInCartSchema };
