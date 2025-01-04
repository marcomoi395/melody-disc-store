"use strict";

const apiKey = require("../models/apiKey.model.js");

class ApiRepository {
    static async findByKey(key) {
        return await apiKey.findOne(key).lean();
    }
}

module.exports = ApiRepository;
