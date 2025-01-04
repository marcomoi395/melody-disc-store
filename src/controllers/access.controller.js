"use strict";

const { SuccessResponse, Created } = require("../core/success.response");
const { registerForClient } = require("../services/access.service");

class AccessController {
    registerForClient = async (req, res) => {
        new Created({
            message: "Sucuessfully registered for client",
            metadata: await registerForClient(req.body),
        }).send(res);
    };
}

module.exports = new AccessController();
