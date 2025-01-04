const { HEADER } = require("../configs/constants.js");
const { FORBIDDEN } = require("../core/error.response.js");
const { findByKey } = require("../services/apiKey.service.js");

const apiKey = async (req, res, next) => {
    if (!req.headers[HEADER.API_KEY]) {
        throw new FORBIDDEN();
    }

    const key = req.headers[HEADER.API_KEY].toString();
    if (!key) {
        throw new FORBIDDEN();
    }

    // Check the key validity
    const foundKey = await findByKey(key);

    req.apiKey = foundKey;
    return next();
};

const permission = (permissions) => {
    return (req, res, next) => {
        if (!req.apiKey?.permissions) throw new FORBIDDEN("Permission denied");

        const validPermissions = permissions.every((e) =>
            req.apiKey.permissions.includes(e),
        );

        if (!validPermissions) throw FORBIDDEN("Permission denied");

        return next();
    };
};

module.exports = {
    apiKey,
    permission,
};
