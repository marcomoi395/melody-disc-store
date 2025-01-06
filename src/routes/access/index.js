"use strict";

const express = require("express");
const router = express.Router();
const asyncHandler = require("../../helper/asyncHandler");
const accessController = require("../../controllers/access.controller");
const { apiKey, permission } = require("../../auth/checkAuth");

router.post(
    "/register/client",
    asyncHandler(accessController.registerForClient),
);

router.post("/login", asyncHandler(accessController.login));

// Authenticated

// Private route
router.post("/register/shop", asyncHandler(accessController.registerForShop));
router.post("/logout", asyncHandler(accessController.logout));
router.post(
    "/refresh-token",
    asyncHandler(accessController.handlerRefreshToken),
);

module.exports = router;
