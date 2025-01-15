const Joi = require("joi");

const productValidationSchema = Joi.object({
    product_name: Joi.string().trim().min(3).required().messages({
        "string.base": "Product name must be a string",
        "string.empty": "Product name is required",
        "string.min": "Product name must be at least 3 characters",
    }),

    product_artist_name: Joi.string().trim().min(3).required().messages({
        "string.base": "Artist name must be a string",
        "string.empty": "Artist name is required",
        "string.min": "Artist name must be at least 3 characters",
    }),

    product_price: Joi.number().min(0).required().messages({
        "number.base": "Price must be a number",
        "number.min": "Price must be greater than or equal to 0",
        "any.required": "Price is required",
    }),

    product_category: Joi.string()
        .valid("vinyl", "cd", "cassette", "merch", "gear")
        .required()
        .messages({
            "any.only":
                "Category must be one of vinyl, cd, cassette, merch, or gear",
            "any.required": "Category is required",
        }),

    product_description: Joi.string().allow("").messages({
        "string.base": "Description must be a string",
    }),

    product_thumbnail: Joi.string()

        .uri()
        .required()
        .messages({
            "string.base": "Thumbnail must be a string",
            "string.uri": "Thumbnail must be a valid URL",
            "string.empty": "Thumbnail is required",
        }),

    product_images: Joi.array()
        .items(
            Joi.string().uri().messages({
                "string.uri": "Each product image must be a valid URL",
            }),
        )
        .messages({
            "array.base": "Product images must be an array of URLs",
        }),

    product_quantity: Joi.number().integer().min(0).required().messages({
        "number.base": "Quantity must be a number",
        "number.integer": "Quantity must be an integer",
        "number.min": "Quantity must be at least 0",
        "any.required": "Quantity is required",
    }),

    product_popularity: Joi.number()
        .integer()
        .min(1)
        .max(5)
        .default(1)
        .messages({
            "number.base": "Popularity must be a number",
            "number.min": "Popularity must be at least 1",
            "number.max": "Popularity must be at most 5",
        }),

    isPublished: Joi.boolean().default(false).messages({
        "boolean.base": "isPublished must be a boolean",
    }),
});

module.exports = { productValidationSchema };
