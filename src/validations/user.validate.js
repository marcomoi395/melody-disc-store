const Joi = require("joi");

const regiterUserValidationSchema = Joi.object({
    name: Joi.string().trim().max(32).required().messages({
        "string.empty": "Name is required",
        "string.max": "Name must not exceed 32 characters",
    }),
    phone: Joi.string().trim().allow("").messages({
        "string.empty": "Phone must be a string",
    }),
    email: Joi.string().trim().email().required().messages({
        "string.empty": "Email is required",
        "string.email": "Email must be a valid email address",
    }),
    password: Joi.string().trim().required().messages({
        "string.empty": "Password is required",
    }),
    status: Joi.forbidden().strip(),
    verify: Joi.forbidden().strip(),
    roles: Joi.forbidden().strip(),
});

const loginUserValidationSchema = Joi.object({
    email: Joi.string().trim().email().required().messages({
        "string.empty": "Email is required",
        "string.email": "Email must be a valid email address",
    }),
    password: Joi.string().trim().required().messages({
        "string.empty": "Password is required",
    }),
});

module.exports = {
    regiterUserValidationSchema,
    loginUserValidationSchema,
};
