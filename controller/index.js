
"use strict";

const express = require("express");
const router = express.Router();
const moment = require("moment");

/* GET home page. */
router.get("/", function(req, res, next) {
    res.json({
        "iso": moment().subtract(process.uptime(), "seconds").toISOString(),
        "seconds": process.uptime()
    });
});

module.exports = router;
