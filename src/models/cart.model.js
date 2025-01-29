const req = require("express/lib/request");
const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "cart";
const COLLECTION_NAME = "carts";

const cartSchema = new Schema(
    {
        cart_state: {
            type: String,
            required: true,
            enum: ["active", "inactive"],
            default: "active",
        },
        cart_products: {
            type: Array,
            required: true,
            default: [],
        },
        cart_user_id: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
    },
    {
        timestamps: true,
        COLLECTION_NAME,
    },
);

module.exports = model(DOCUMENT_NAME, cartSchema);
