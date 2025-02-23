"use strict";

const express = require("express");
const router = express.Router();
const asyncHandler = require("../../helper/asyncHandler");
const discountController = require("../../controllers/discount.controller");
const { apiKey, permission } = require("../../auth/checkAuth");
const { authentication, checkRoles } = require("../../auth/authUtils");

// Authenticated
router.use(asyncHandler(authentication));
router.use(checkRoles(["shop", "admin"]));

// Private route
router.post("", asyncHandler(discountController.createDiscount));

router.patch(
    "/update/:discountId",
    asyncHandler(discountController.updateDiscount),
);

router.get(
    "/get-all-discount",
    asyncHandler(discountController.getAllDiscountForShop),
);

router.delete(
    "/delete-discount/:discountId",
    asyncHandler(discountController.deleteDiscountForShop),
);

router.patch(
    "/change-status",
    asyncHandler(discountController.changeStatusDiscount),
);

module.exports = router;
