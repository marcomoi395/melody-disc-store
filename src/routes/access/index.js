"use strict";

const express = require("express");
const router = express.Router();
const asyncHandler = require("../../helper/asyncHandler");
const accessController = require("../../controllers/access.controller");
const { apiKey, permission } = require("../../auth/checkAuth");
const { authentication } = require("../../auth/authUtils");

router.post(
    "/register/client",
    asyncHandler(accessController.registerForClient),
);

router.post("/login", asyncHandler(accessController.login));

// Authenticated
router.use(asyncHandler(authentication));

// Private route
router.post("/register/shop", asyncHandler(accessController.registerForShop));
router.post("/logout", asyncHandler(accessController.logout));
router.post(
    "/refresh-token",
    asyncHandler(accessController.handlerRefreshToken),
);

module.exports = router;
