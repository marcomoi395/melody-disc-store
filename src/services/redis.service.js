"use strict";

const redis = require("redis");
const { promisify } = require("util");
const { reservationInventory } = require("../repositories/inventory.repo");
const redisClient = redis.createClient();

const pexpireAsync = async (key, ttl) => {
    return await redisClient.pexpire(key, ttl);
};

const setxAsync = async (key, value) => {
    return await redisClient.set(key, value);
};

const acquireLock = async (product_id, quantity, cartId) => {
    const key = `lock_v2025_${product_id}`;
    const retryTimes = 10;
    const expireTime = 3000;

    for (let i = 0; i < retryTimes; i++) {
        const result = await setxAsync(key, expireTime);

        if (result === 1) {
            // Handle
            const isReservation = await reservationInventory(
                product_id,
                quantity,
                cartId,
            );
            if (isReservation.modifiedCount) {
                await pexpireAsync(key, expireTime);
                return key;
            }
            return null;
        } else {
            await new Promise((resolve) => setTimeout(resolve, 50));
        }
    }
};

const releaseLock = async (keyLock) => {
    const delAsyncKey = promisify(redisClient.del).bind(redisClient);
    return await delAsyncKey(keyLock);
};

module.exports = { acquireLock, releaseLock };
