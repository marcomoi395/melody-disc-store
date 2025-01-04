"use strict";

const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "user",
    COLLECTION_NAME = "users";

const userSchema = new Schema(
    {
        name: {
            type: String,
            requrire: true,
            trim: true,
            maxLength: 32,
        },
        phone: {
            type: String,
            trim: true,
            default: "",
        },
        email: {
            type: String,
            trim: true,
            requrire: true,
        },
        password: {
            type: String,
            trim: true,
            requrire: true,
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },
        verify: {
            type: Schema.Types.Boolean,
            default: false,
        },
        roles: {
            type: Array,
            default: [],
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    },
);

module.exports = model(DOCUMENT_NAME, userSchema);
