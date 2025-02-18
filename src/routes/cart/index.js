"use strict";

const express = require("express");
const router = express.Router();
const asyncHandler = require("../../helper/asyncHandler");
const cartController = require("../../controllers/cart.controller");
const { apiKey, permission } = require("../../auth/checkAuth");
const { authentication, checkRoles } = require("../../auth/authUtils");

// Authenticated
router.use(asyncHandler(authentication));

router.get("", asyncHandler(cartController.getCartForUser));

router.post("", asyncHandler(cartController.addProductToCart));

router.post(
    "/change-quantity",
    asyncHandler(cartController.changeQuantityProductInCart),
);

router.delete(
    "/delete-product",
    asyncHandler(cartController.deleteProductFromCart),
);

module.exports = router;
