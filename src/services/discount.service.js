"use strict";

const {
    BAD_REQUEST,
    UNAUTHORIZED,
    FORBIDDEN,
} = require("../core/error.response.js");
const {
    createDiscount,
    findByCode,
} = require("../repositories/discount.repo.js");
const { getProducts } = require("../repositories/product.repo.js");
const { convertToObjectId } = require("../utils/index.js");
const createDiscountValidation = require("../validations/discount.validation.js");

class DiscountService {
    static async createDiscount(body, userId) {
        // Validating
        const { error, value } = createDiscountValidation.validate(body, {
            stripUnknown: true,
        });

        if (error) throw new BAD_REQUEST(error.message);

        if (
            new Date() < new Date(value.discount_start_date) ||
            new Date() > new Date(value.discount_end_date)
        )
            throw new BAD_REQUEST("Invalid date");

        // Check existing discount
        const foundDiscount = await findByCode(value.discount_code);
        if (foundDiscount.length > 0)
            throw new FORBIDDEN("Discount already exists");

        // Check list product
        if (value.apply_to === "specific_products") {
            const newId = await getProducts({
                _id: { $in: value.discount_product_ids },
                products_shop: convertToObjectId(userId),
            });

            if (newId.length !== value.discount_product_ids.length)
                throw new BAD_REQUEST("Invalid product id");
        }

        // Add key shopId
        value.discount_user_id = convertToObjectId(userId);

        // Create new discount
        return await createDiscount(value);
    }
}

module.exports = DiscountService;
