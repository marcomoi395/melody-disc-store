"use strict";

const express = require("express");
const router = express.Router();
const asyncHandler = require("../../helper/asyncHandler");
const productController = require("../../controllers/product.controller");
// const { authentication } = require("../../auth/authUtils");

router.get("/", asyncHandler(productController.getAllProducts));
router.get("/:product_id", asyncHandler(productController.getProduct));

router.post("/", asyncHandler(productController.getProduct));

module.exports = router;
