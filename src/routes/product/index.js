"use strict";

const express = require("express");
const router = express.Router();
const asyncHandler = require("../../helper/asyncHandler");
const productController = require("../../controllers/product.controller");
const { apiKey, permission } = require("../../auth/checkAuth");
const { authentication, checkRoles } = require("../../auth/authUtils");

router.get("/", asyncHandler(productController.getAllProducts));
router.get("/result", asyncHandler(productController.searchProductsByUser));
router.get("/:product_id", asyncHandler(productController.getProduct));
router.get(
    "/category/:category",
    asyncHandler(productController.getProductsByCategory),
);

// Check Permission [{view: "0000", edit: "1111",}]
// router.use(asyncHandler(apiKey));
// router.use(permission(["0000", "1111"]));

// Authenticated
router.use(asyncHandler(authentication));
router.use(checkRoles(["shop", "admin"]));

router.post("/", asyncHandler(productController.createProduct));
router.patch(
    "/publish-product/:product_id",
    asyncHandler(productController.publishProductForShop),
);

router.patch(
    "/draft-product/:product_id",
    asyncHandler(productController.draftProductForShop),
);

router.patch(
    "/change-status",
    asyncHandler(productController.changeStatusProducts),
);

module.exports = router;
