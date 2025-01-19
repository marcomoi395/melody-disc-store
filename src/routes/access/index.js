"use strict";

const express = require("express");
const router = express.Router();
const asyncHandler = require("../../helper/asyncHandler");
const accessController = require("../../controllers/access.controller");
const { apiKey, permission } = require("../../auth/checkAuth");
const { authentication, checkRoles } = require("../../auth/authUtils");

router.post(
    "/register/client",
    asyncHandler(accessController.registerForClient),
);

router.post("/login", asyncHandler(accessController.login));

// Authenticated
router.use(asyncHandler(authentication));
router.use(checkRoles(["admin", "shop"]));

// Private route
router.post("/logout", asyncHandler(accessController.logout));
router.post(
    "/refresh-token",
    asyncHandler(accessController.handlerRefreshToken),
);

router.use(checkRoles(["admin"]));
router.post("/register/shop", asyncHandler(accessController.registerForShop));

module.exports = router;
