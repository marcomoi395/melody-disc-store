const Joi = require("joi");
const mongoose = require("mongoose");

const createDiscountValidation = Joi.object({
    discount_name: Joi.string().trim().required(),
    discount_description: Joi.string().required(),
    discount_type: Joi.string().valid("fixed_amount", "percentage").required(),
    discount_value: Joi.number().required(),
    discount_code: Joi.string().required(),
    discount_start_date: Joi.date().iso().required(),
    discount_end_date: Joi.date()
        .iso()
        .greater(Joi.ref("discount_start_date"))
        .required(),
    discount_max_usage: Joi.number().integer().min(1).required(),
    discount_used_count: Joi.number().integer().min(0).default(0),
    discount_users_used: Joi.array().items(Joi.string()).default([]),
    discount_max_uses_per_user: Joi.number().integer().min(1).required(),
    discount_min_order_amount: Joi.number().min(0).required(),
    discount_apply_to: Joi.string()
        .valid("all_products", "specific_products")
        .required(),
    discount_product_ids: Joi.array().items(Joi.string()).default([]),
});

const updateDiscountValidation = Joi.object({
    discount_name: Joi.string().trim(),
    discount_description: Joi.string(),
    discount_type: Joi.string().valid("fixed_amount", "percentage"),
    discount_value: Joi.number(),
    discount_code: Joi.string(),
    discount_start_date: Joi.date().iso(),
    discount_end_date: Joi.date().iso().greater(Joi.ref("discount_start_date")),
    discount_max_usage: Joi.number().integer().min(1),
    discount_used_count: Joi.number().integer().min(0),
    discount_users_used: Joi.array().items(Joi.string()),
    discount_max_uses_per_user: Joi.number().integer().min(1),
    discount_min_order_amount: Joi.number().min(0),
    discount_apply_to: Joi.string().valid("all_products", "specific_products"),
    discount_product_ids: Joi.array().items(Joi.string()),
});

module.exports = { createDiscountValidation, updateDiscountValidation };
