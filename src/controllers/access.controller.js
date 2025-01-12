"use strict";

const { SuccessResponse, Created } = require("../core/success.response");
const {
    registerForClient,
    login,
    logout,
    handlerRefreshToken,
    registerForShop,
} = require("../services/access.service");

class AccessController {
    registerForClient = async (req, res) => {
        new Created({
            message: "Sucuessfully registered for client",
            metadata: await registerForClient(req.body),
        }).send(res);
    };

    registerForShop = async (req, res) => {
        new Created({
            message: "Sucuessfully registered for shop",
            metadata: await registerForShop(req.body, req.user.userId),
        }).send(res);
    };

    login = async (req, res) => {
        new SuccessResponse({
            message: "Sucuessfully login",
            metadata: await login(req.body),
        }).send(res);
    };

    logout = async (req, res) => {
        new SuccessResponse({
            message: "Sucuessfully logout",
            metadata: await logout(req.keyStore),
        }).send(res);
    };

    handlerRefreshToken = async (req, res) => {
        new SuccessResponse({
            message: "Sucuessfully registered for client",
            metadata: await handlerRefreshToken({
                user: req.user,
                keyStore: req.keyStore,
                refreshToken: req.refreshToken,
            }),
        }).send(res);
    };
}

module.exports = new AccessController();
