"use strict";

const _ = require("lodash");
const mongoose = require("mongoose");
const crypto = require("node:crypto");

const getInfoData = ({ filed = [], object = {} }) => {
    return _.pick(object, filed);
};

const getPrivateAndPublicKey = () => {
    return {
        privateKey: crypto.randomBytes(64).toString("hex"),
        publicKey: crypto.randomBytes(64).toString("hex"),
    };
};

const getSelectData = (select = []) => {
    return Object.fromEntries(select.map((el) => [el, 1]));
};

const unGetSelectData = (unSelect = []) => {
    return Object.fromEntries(unSelect.map((el) => [el, 0]));
};

const removeUndefined = (obj) => {
    Object.keys(obj).forEach((key) => {
        if (obj[key] === null || obj[key] === undefined) {
            delete obj[key];
        }
    });

    return obj;
};

/* Nested Object Parser
[1]::
{
    a: {
        b: {
            c: 1
        }
    }
}

[2]::
{
    'a.b.c': 1
}
 */
const updateNestedObjectParser = (obj) => {
    const final = {};

    Object.keys(obj).forEach((key) => {
        if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
            const response = updateNestedObjectParser(obj[key]);
            Object.keys(response).forEach((subKey) => {
                final[`${key}.${subKey}`] = response[subKey];
            });
        } else {
            final[key] = obj[key];
        }
    });

    return final;
};

const convertToObjectId = (id) => new mongoose.Types.ObjectId(id);

module.exports = {
    getInfoData,
    getPrivateAndPublicKey,
    getSelectData,
    unGetSelectData,
    removeUndefined,
    updateNestedObjectParser,
    convertToObjectId,
};
