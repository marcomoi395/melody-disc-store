"use strict";

const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "userKeyStore",
    COLLECTION_NAME = "userKeyStores";

const userKeyStoreSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        publicKey: {
            type: String,
            required: true,
        },
        privateKey: {
            type: String,
            required: true,
        },
        refreshToken: {
            type: String,
            required: true,
        },
        refreshTokensUsed: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    },
);

module.exports = model(DOCUMENT_NAME, userKeyStoreSchema);
