"use strict";

const keyStore = require("../models/userKeyStore.model.js");

class UserKeyStoreRepository {
    static async findByUserId(userId) {
        return await keyStore.findOne({ userId }).lean();
    }

    static async createKeyStore({
        userId,
        refreshToken,
        publicKey,
        privateKey,
    }) {
        const query = {
                userId,
            },
            update = {
                publicKey,
                privateKey,
                refreshToken,
                refreshTokenUsed: [],
            },
            options = {
                upsert: true,
                new: true,
            };
        return await keyStore.findOneAndUpdate(query, update, options);
    }

    static async removeKeyStore(userId) {
        return await keyStore.deleteOne({ userId });
    }

    static async updateKeyStore(userId, updateSet, options = {}) {
        return await keyStore.updateOne({ userId }, updateSet, options);
    }
}

module.exports = UserKeyStoreRepository;
