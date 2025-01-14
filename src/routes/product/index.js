"use strict";

const express = require("express");
const router = express.Router();
const asyncHandler = require("../../helper/asyncHandler");
const productController = require("../../controllers/product.controller");
const { apiKey, permission } = require("../../auth/checkAuth");
const { authentication, checkRoles } = require("../../auth/authUtils");

router.get("/", asyncHandler(productController.getAllProducts));
router.get("/:product_id", asyncHandler(productController.getProduct));

// Check Permission [{view: "0000", edit: "1111",}]
// router.use(asyncHandler(apiKey));
// router.use(permission(["0000", "1111"]));

// Authenticated
router.use(asyncHandler(authentication));

router.use(checkRoles(["shop"]));

router.post("/", asyncHandler(productController.createProduct));

module.exports = router;
