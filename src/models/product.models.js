"use strict";

const { Schema, model } = require("mongoose");
const slugify = require("slugify");

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";

const productSchema = new Schema(
    {
        product_name: {
            type: String,
            required: true,
            trim: true,
        },
        product_artist_name: {
            type: String,
            required: true,
            trim: true,
        },
        product_price: {
            type: Number,
            required: true,
        },
        product_description: {
            type: String,
            required: true,
        },
        product_slug: {
            type: String,
            required: true,
            default: function () {
                return slugify(this.product_name || "default-slug", {
                    lower: true,
                });
            },
        },
        prpduct_thumbnail: {
            type: String,
            required: true,
        },
        product_images: {
            type: [String],
        },
        product_quantity: {
            type: Number,
            required: true,
        },
        product_type: {
            type: String,
            required: true,
            enum: ["vinyl", "cd", "cassette", "merch", "gear"],
        },
        product_shop: {
            type: Schema.Types.ObjectId,
            ref: "Shop",
            required: true,
        },
        product_attributes: {
            type: Schema.Types.Mixed,
            required: true,
        },
        isDraft: {
            type: Boolean,
            default: true,
            index: true,
            select: false,
        },
        isPublished: {
            type: Boolean,
            default: false,
            index: true,
            select: false,
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    },
);

// Create index for search
productSchema.index({ product_name: "text", product_description: "text" });

// Middleware (run before .save() and .create())
productSchema.pre("findOneAndUpdate", function (next) {
    const update = this.getUpdate();
    if (update.product_name) {
        update.product_slug = slugify(update.product_name, { lower: true });
    }
    next();
});

module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
};
