"use strict";

const JWT = require("jsonwebtoken");

const createTokenPair = (payload, publicKey, privateKey) => {
    try {
        const accessToken = JWT.sign(payload, publicKey, {
            expiresIn: "1h",
        });

        const refreshToken = JWT.sign(payload, privateKey, {
            expiresIn: "7d",
        });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new Error(error);
    }
};

module.exports = {
    createTokenPair,
};
