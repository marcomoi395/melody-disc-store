"use strict";

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "order";
const COLLECTION_NAME = "orders";

const orderSchema = new Schema(
    {
        order_user_id: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        order_checkout: { type: Object, required: true },
        order_shipping: {
            type: Object,
            defalt: {},
        },
        order_payment: {
            type: Object,
            default: {},
        },
        order_products: { type: Array, default: [] },
        order_products: {
            type: Array,
            required: true,
        },
        order_status: {
            type: String,
            enum: ["pending", "confirm", "shipped", "cancel", "delivered"],
            default: "pending",
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    },
);

module.exports = model(DOCUMENT_NAME, orderSchema);
