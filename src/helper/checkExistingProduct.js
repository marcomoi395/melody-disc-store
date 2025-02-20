"use strict";

const { getProducts } = require("../repositories/product.repo");

module.exports = async (payload) => {
    console.log(payload);
    const idArray = payload.map((item) => item.product_id);

    const foundProducts = await getProducts({
        _id: { $in: idArray },
        isPublished: true,
    });

    if (foundProducts.length !== idArray.length) return false;

    foundProducts.forEach((product) => {
        if (
            payload.find((item) => item.product_id === product._id.toString())
                .price !== product.product_price
        )
            return false;
    });

    return true;
};
