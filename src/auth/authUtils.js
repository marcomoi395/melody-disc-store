"use strict";

const JWT = require("jsonwebtoken");
const { HEADER } = require("../configs/constants.js");
const { UNAUTHORIZED, NOT_FOUND } = require("../core/error.response.js");
const { findByUserId } = require("../services/userKeyStore.service.js");

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

const authentication = async (req, res, next) => {
    const userId = req.headers[HEADER.USER_ID];
    if (!userId) throw new UNAUTHORIZED("Invalid Request");

    const keyStore = await findByUserId(userId);
    if (!keyStore) throw new NOT_FOUND("KeyStore not found");

    if (req.headers[HEADER.REFRESH_TOKEN]) {
        try {
            const refreshToken = req.headers[HEADER.REFRESH_TOKEN];
            const decodeUser = JWT.verify(refreshToken, keyStore.privateKey);
            if (userId !== decodeUser.userId)
                throw new UNAUTHORIZED("Invalid Request");
            req.keyStore = keyStore;
            req.user = decodeUser;
            req.refreshToken = refreshToken;
            return next();
        } catch (e) {
            throw new UNAUTHORIZED("Invalid Request");
        }
    }

    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken || accessToken === "null")
        throw new UNAUTHORIZED("Invalid Request");

    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
        if (userId !== decodeUser.userId)
            throw new UNAUTHORIZED("Invalid Request");
        req.keyStore = keyStore;
        req.user = decodeUser;
        return next();
    } catch (e) {
        throw new UNAUTHORIZED("Invalid Request");
    }
};

module.exports = {
    createTokenPair,
    authentication,
};
