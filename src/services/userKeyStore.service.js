"use strict";

const {
    createKeyStore,
    removeKeyStore,
    updateKeyStore,
    findByUserId,
} = require("../repositories/userKeyStore.repo");

class KeyStoreService {
    static async createKeyStore(payload) {
        return await createKeyStore(payload);
    }

    static async removeKeyStore(userId) {
        return await removeKeyStore(userId);
    }

    static async updateKeyStore(userId, updateSet) {
        return await updateKeyStore(userId, updateSet);
    }

    static async findByUserId(userId) {
        return await findByUserId(userId);
    }
}

module.exports = KeyStoreService;
