"use strict";

const { StatusCodes, ReasonPhrases } = require("../utils/httpStatusCode");

class ErrorResponse extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

const errorResponseObject = {};

const keys = Object.keys(StatusCodes);
for (let i = 0; i < keys.length; i++) {
    const key = keys[i]; // Lấy mỗi key từ StatusCodes

    // Tạo class mới kế thừa từ ErrorResponse
    errorResponseObject[key] = class extends ErrorResponse {
        constructor(
            message = ReasonPhrases[key], // Dùng key để lấy message tương ứng
            status = StatusCodes[key], // Dùng key để lấy status tương ứng
        ) {
            super(message, status); // Gọi constructor của lớp cha
        }
    };
}

module.exports = errorResponseObject;
