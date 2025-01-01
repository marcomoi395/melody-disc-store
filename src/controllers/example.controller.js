/* 
"use strict";

const { login } = require("../services/access.service");
const { SuccessResponse } = require("../core/success.response");

class AccessController {
    login = async (req, res) => {
        new SuccessResponse({
            message: "Login successfully",
            metadata: await login(req.body),
        }).send(res);
    };
}

module.exports = new AccessController();
 */
