/*
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
        product_image: {
            type: String,
            required: true,
        },
        product_quantity: {
            type: Number,
            required: true,
        },
        product_type: {
            type: String,
            required: true,
            enum: ["Electronics", "Clothing"],
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
        product_ratingsAverage: {
            type: Number,
            default: 4.5,
            min: [1, "Rate must be above 1.0"],
            max: [5, "Rate must be below 5.0"],
            set: (val) => Math.round(val * 10) / 10,
        },
        product_variations: {
            type: Array,
            default: [],
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

const clothingSchema = new Schema(
    {
        branch: {
            type: String,
            required: true,
        },
        size: {
            type: String,
            required: true,
        },
        color: {
            type: String,
            required: true,
        },
        material: {
            type: String,
            required: true,
        },
        product_shop: {
            type: Schema.Types.ObjectId,
            ref: "Shop",
            required: true,
        },
    },
    {
        timestamps: true,
        collection: "Clothing",
    },
);

const electronicsSchema = new Schema(
    {
        manufacturer: {
            type: String,
            required: true,
        },
        color: {
            type: String,
            required: true,
        },
        warranty: {
            type: String,
            required: true,
        },
        product_shop: {
            type: Schema.Types.ObjectId,
            ref: "Shop",
            required: true,
        },
    },
    {
        timestamps: true,
        collection: "Electronics",
    },
);

module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    clothing: model("Clothing", clothingSchema),
    electronics: model("Electronics", electronicsSchema),
};
*/
