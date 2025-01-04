"use strict";

const user = require("../models/user.model");

class UserRepository {
    static async findUserByEmail(email) {
        return await user.findOne({ email }).lean();
    }

    static async createNewUser(body) {
        return await user.create(body);
    }
}

module.exports = UserRepository;
