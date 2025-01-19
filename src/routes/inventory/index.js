"use strict";

const express = require("express");
const router = express.Router();
const asyncHandler = require("../../helper/asyncHandler");
const inventoryController = require("../../controllers/inventory.controller");
const { authentication, checkRoles } = require("../../auth/authUtils");

router.use(asyncHandler(authentication));
router.use(checkRoles(["shop", "admin"]));

router.post("/", asyncHandler(inventoryController.addStockToInventory));

module.exports = router;
