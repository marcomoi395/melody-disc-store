const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "inventory";
const COLLECTION_NAME = "inventorys";

const inventorySchema = new Schema(
    {
        inventory_product_id: {
            type: Schema.Types.ObjectId,
            ref: "product",
            required: true,
        },
        inventory_stock: {
            type: Number,
            required: true,
        },
        inventory_reservations: {
            type: Array,
            default: [],
        },
    },
    {
        timestamps: true,
        COLLECTION_NAME,
    },
);

module.exports = model(DOCUMENT_NAME, inventorySchema);
