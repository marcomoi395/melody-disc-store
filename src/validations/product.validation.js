const Joi = require("joi");

// Validation cho product schema
const productValidationSchema = Joi.object({
    product_name: Joi.string().required().min(3).max(255).messages({
        "string.base": '"product_name" phải là một chuỗi',
        "string.empty": '"product_name" không được để trống',
        "string.min": '"product_name" phải có ít nhất 3 ký tự',
        "string.max": '"product_name" không được quá 255 ký tự',
        "any.required": '"product_name" là trường bắt buộc',
    }),

    product_thumbnail: Joi.string().uri().required().messages({
        "string.base": '"product_thumbnail" phải là một chuỗi',
        "string.empty": '"product_thumbnail" không được để trống',
        "string.uri": '"product_thumbnail" phải là một URL hợp lệ',
        "any.required": '"product_thumbnail" là trường bắt buộc',
    }),

    product_images: Joi.array().items(Joi.string().uri()).optional().messages({
        "array.base": '"product_images" phải là một mảng',
        "string.uri": '"product_images" phải chứa các URL hợp lệ',
    }),

    product_quantity: Joi.number().integer().min(0).required().messages({
        "number.base": '"product_quantity" phải là một số',
        "number.integer": '"product_quantity" phải là số nguyên',
        "number.min": '"product_quantity" không thể nhỏ hơn 0',
        "any.required": '"product_quantity" là trường bắt buộc',
    }),

    product_popularity: Joi.number()
        .integer()
        .min(1)
        .max(5)
        .default(1)
        .messages({
            "number.base": '"product_popularity" phải là một số',
            "number.integer": '"product_popularity" phải là số nguyên',
            "number.min": '"product_popularity" phải lớn hơn hoặc bằng 1',
            "number.max": '"product_popularity" phải nhỏ hơn hoặc bằng 5',
        }),

    isDraft: Joi.boolean().default(true).messages({
        "boolean.base": '"isDraft" phải là một giá trị boolean',
    }),

    isPublished: Joi.boolean().default(false).messages({
        "boolean.base": '"isPublished" phải là một giá trị boolean',
    }),
});

module.exports = productValidationSchema;
