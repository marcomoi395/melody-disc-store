"use strict";

const user = require("../models/user.model");

class UserRepository {
    static async findOneUser(query) {
        return await user.findOne(query).lean();
    }

    static async createNewUser(body) {
        return await user.create(body);
    }
}

module.exports = UserRepository;
