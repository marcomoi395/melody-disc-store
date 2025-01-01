"use strict";

const express = require("express");
const router = express.Router();
/* 
// Check API
router.use(apiKey);
// Check Permission
router.use(permission("0000"));
 */

router.get("", (req, res) => {
    res.send("Welcome to the Melody Disc");
});

module.exports = router;
