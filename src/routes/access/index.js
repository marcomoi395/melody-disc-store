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

module.exports = router;
