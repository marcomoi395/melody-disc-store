"use strict";

const { findOneUser, createNewUser } = require("../repositories/user.repo.js");
const { BAD_REQUEST, UNAUTHORIZED } = require("../core/error.response.js");
const {
    regiterUserValidationSchema,
    loginUserValidationSchema,
} = require("../validations/user.validate.js");
const { getPrivateAndPublicKey, getInfoData } = require("../utils/index.js");
const bcrypt = require("bcrypt");
const { createTokenPair } = require("../auth/authUtils.js");

class AccessService {
    /* {
        name,
        email,
        password,
        phone (optional)
    } */

    static async registerForClient(body) {
        const { value, error } = regiterUserValidationSchema.validate(body, {
            stripUnknown: true,
        });

        if (error) throw new BAD_REQUEST(error);

        const { email, password, name, phone = "" } = value;
        // Check email existence
        const foundUser = await findOneUser({ email });
        if (foundUser) throw new BAD_REQUEST("Email already exists");

        // Hash the password
        const hashPassword = await bcrypt.hash(password, 10);

        // Create new client
        const newUser = await createNewUser({
            email,
            name,
            password: hashPassword,
            phone,
        });

        return getInfoData({
            fields: ["_id", "name", "email", "phone"],
            object: newUser,
        });
    }

    static async registerForShop(body, userId) {
        const { value, error } = regiterUserValidationSchema.validate(body, {
            stripUnknown: true,
        });

        if (error) throw new BAD_REQUEST(error);

        // Check permission
        const foundUser = await findOneUser({ _id: userId });
        if (!foundUser?.roles.includes("admin"))
            throw new BAD_REQUEST("Permission denied");

        const { email, password, name, phone = "" } = value;

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = await createNewUser({
            email,
            password: hashPassword,
            name,
            phone,
            roles: ["shop"],
            verify: true,
        });

        return getInfoData({
            fields: ["_id", "name", "email", "phone"],
            object: newUser,
        });
    }

    /* {
        email,
        password,
    } */

    static async login(body) {
        // validate body
        const { value, error } = loginUserValidationSchema.validate(body, {
            stripUnknown: true,
        });

        if (error) throw new BAD_REQUEST(error);

        const { email, password } = value;

        // Check email existence
        const foundUser = await findOneUser({ email });
        if (!foundUser) throw new UNAUTHORIZED("Invalid user or password");

        // Compare password
        const verifyPassword = await bcrypt.compare(
            password,
            foundUser.password,
        );

        if (!verifyPassword) throw new UNAUTHORIZED("Invalid user or password");

        // Create PriKey and PubKey
        const { privateKey, publicKey } = getPrivateAndPublicKey();

        // Create token pair
        const tokens = createTokenPair(
            { userId: foundUser._id, email },
            publicKey,
            privateKey,
        );

        // Save to keyToken
        //

        return {
            user: getInfoData({
                fields: ["_id", "name", "email"],
                object: foundUser,
            }),
            tokens,
        };
    }

    static async logout(keyStore) {
        // Remove key by Id
    }

    static async handlerRefreshToken({ refreshToken, user, keyStore }) {
        const { userId, email } = user;

        if (keyStore.refreshTokensUsed.includes(refreshToken)) {
            // reuse refresh token so clear keyStore
            // clear keyStore

            throw new FORBIDDEN("Something went wrong, please login again");
        }

        if (keyStore.refreshToken !== refreshToken) {
            throw new FORBIDDEN("Invalid refresh token");
        }

        // Check userId
        const foundUser = await findOneUser({ _id: userId });
        if (!foundUser) throw new UNAUTHORIZED("Invalid user");

        // Create new token pair
        const tokens = createTokenPair(
            { userId: foundUser._id, email },
            keyStore.publicKey,
            keyStore.privateKey,
        );

        // Update keyStore

        return {
            user,
            tokens,
        };
    }
}

module.exports = AccessService;
