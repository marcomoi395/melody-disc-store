"use strict";

const { getProduct } = require("../repositories/product.repo");

module.exports = async (payload) => {
    const foundProduct = await getProduct({
        _id: payload.product_id,
        isPublished: true,
    });

    if (!foundProduct) return false;
    if (payload.price !== foundProduct.product_price) return false;

    return true;
};
