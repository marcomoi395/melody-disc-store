"use strict";

const { findByKey } = require("../repositories/apiKey.repo");

class ApiService {
    static async findByKey(key) {
        return await findByKey({ key });
    }
}

module.exports = ApiService;
