"use strict";

const {
    findUserByEmail,
    createNewUser,
} = require("../repositories/user.repo.js");
const { BAD_REQUEST } = require("../core/error.response.js");
const userValidationSchema = require("../validations/user.validate.js");
const { getPrivateAndPublicKey, getInfoData } = require("../utils/index.js");
const bcrypt = require("bcrypt");

class AccessService {
    /* {
        name,
        email,
        password,
        phone (optional)
    } */

    static async registerForClient(body) {
        const { value, error } = userValidationSchema.validate(body, {
            stripUnknown: true,
        });

        if (error) throw new BAD_REQUEST(error);

        const { email, password, name, phone = "" } = value;
        // Check email existence
        const foundUser = await findUserByEmail(email);
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
}

module.exports = AccessService;
