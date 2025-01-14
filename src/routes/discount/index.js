"use strict";

const express = require("express");
const router = express.Router();
const asyncHandler = require("../../helper/asyncHandler");
const discountController = require("../../controllers/discount.controller");
const { apiKey, permission } = require("../../auth/checkAuth");
const { authentication, checkRoles } = require("../../auth/authUtils");

// Authenticated
router.use(asyncHandler(authentication));
router.use(checkRoles(["shop"]));

// Private route
router.post("", asyncHandler(discountController.createDiscount));
module.exports = router;
