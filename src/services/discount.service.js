"use strict";

const { BAD_REQUEST, FORBIDDEN } = require("../core/error.response.js");
const {
    createDiscount,
    getDiscount,
    updateDiscount,
    deleteDiscount,
    updateDiscountAndReturn,
    getDiscounts,
} = require("../repositories/discount.repo.js");
const { getProducts } = require("../repositories/product.repo.js");
const {
    convertToObjectId,
    updateNestedObjectParser,
} = require("../utils/index.js");
const {
    createDiscountValidation,
    updateDiscountValidation,
} = require("../validations/discount.validation.js");

class DiscountService {
    static async getDiscountAmount(userId, body) {
        const { code, products } = body;
        const foundDiscount = await getDiscount({
            discount_code: code,
            discount_is_active: true,
        });

        if (!foundDiscount) throw new BAD_REQUEST("Discount not found");

        if (foundDiscount.discount_max_uses <= 0)
            throw new BAD_REQUEST("Discount is expired");

        if (
            new Date() < new Date(foundDiscount.discount_start_date) ||
            new Date() > new Date(foundDiscount.discount_end_date)
        )
            throw new BAD_REQUEST("Discount is expired");

        let ids = products.map((product) => product._id);

        if (foundDiscount.discount_apply_to === "specific_products") {
            ids = ids.filter((item) =>
                foundDiscount.discount_product_ids.includes(item),
            );
        }

        if (ids.length === 0) {
            throw new BAD_REQUEST("Invalid product id");
        }

        const foundProducts = await getProducts({
            _id: { $in: ids },
        });

        let totalOrder = 0;
        // get total order
        totalOrder = foundProducts.reduce((acc, product) => {
            const quantity = products.find(
                (item) => item._id === product._id.toString(),
            ).quantity;

            return acc + product.product_price * quantity;
        }, 0);

        if (totalOrder < foundDiscount.discount_min_order_amount)
            throw new BAD_REQUEST("Discount requires a minimum order amount");

        const countUserUsage = foundDiscount.discount_user_used.filter(
            (item) => item === userId,
        ).length;
        if (countUserUsage > foundDiscount.discount_max_uses_per_user)
            throw new BAD_REQUEST(
                "Account has exceeded the number of times allowed for use",
            );

        const amount =
            foundDiscount.discount_type === "fix_amount"
                ? foundDiscount.discount_value
                : (totalOrder * foundDiscount.discount_value) / 100;

        return {
            totalOrder,
            discount: amount,
            totalPrice: totalOrder - amount,
        };
    }

    static async createDiscount(body) {
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
        const foundDiscount = await getDiscount({
            discount_code: value.discount_code,
        });

        if (foundDiscount) throw new FORBIDDEN("Discount already exists");

        // Check list product
        if (value.discount_apply_to === "specific_products") {
            {
                if (value.discount_product_ids.length === 0)
                    throw new BAD_REQUEST("Invalid product id");

                const newId = await getProducts({
                    _id: { $in: value.discount_product_ids },
                });

                if (newId.length !== value.discount_product_ids.length)
                    throw new BAD_REQUEST("Invalid product id");
            }
        } else {
            delete value.discount_product_ids;
        }

        // Create new discount
        return await createDiscount(value);
    }

    static async updateDiscount(body, discountId) {
        const { error, value } = updateDiscountValidation.validate(body, {
            stripUnknown: true,
        });

        if (error) throw new BAD_REQUEST(error.message);

        return await updateDiscountAndReturn(
            {
                _id: discountId,
            },
            { $set: updateNestedObjectParser(value) },
        );
    }

    static async getAllProductsByDiscountCodeForShop(code) {
        const foundDiscount = await getDiscount({
            discount_code: code,
        });

        if (!foundDiscount) throw new BAD_REQUEST("Discount not found");

        if (foundDiscount.discount_apply_to === "all_products") {
            return await getProducts({});
        }

        return await getProducts({
            _id: { $in: foundDiscount.discount_product_ids },
        });
    }

    static async getAllDiscountsForShop() {
        return await getDiscounts({});
    }

    static async deleteDiscountForShop(discount_id) {
        return await deleteDiscount({
            _id: discount_id,
        });
    }

    static async changeStatusDiscount(body) {
        const { discount_ids, new_status } = body;
        const isActive = new_status === "active" ? true : false;
        return await updateDiscount(
            {
                _id: { $in: discount_ids },
            },
            { discount_is_active: isActive },
        );
    }
}

module.exports = DiscountService;
