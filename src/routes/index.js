"use strict";

const express = require("express");
const router = express.Router();
/* 
// Check API
router.use(apiKey);
// Check Permission
router.use(permission("0000"));
 */

const VERSION_API = "/v1/api";

router.get("", (req, res) => {
    res.send("Welcome to the Melody Disc");
});

router.use(`${VERSION_API}/product`, require("./product"));

module.exports = router;
