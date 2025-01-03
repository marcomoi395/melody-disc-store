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
            minlength: [3, "Product name must be at least 3 characters"],
        },
        product_artist_name: {
            type: String,
            required: true,
            trim: true,
            minlength: [3, "Artist name must be at least 3 characters"],
        },
        product_price: {
            type: Number,
            required: true,
            min: [0, "Price must be greater than or equal to 0"],
        },
        product_category: {
            type: String,
            required: true,
            enum: ["vinyl", "cd", "cassette", "merch", "gear"],
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
        product_popularity: {
            type: Number,
            default: 1,
            min: [1, "Popularity must be greater than or equal to 1"],
            max: [5, "Popularity must be less than or equal to 5"],
        },
        product_shop: {
            type: Schema.Types.ObjectId,
            ref: "Shop",
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

module.exports = model(DOCUMENT_NAME, productSchema);
