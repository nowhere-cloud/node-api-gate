
"use strict";

const express = require("express");
const router = express.Router();
const moment = require("moment");

/* GET home page. */
router.get("/", function(req, res, next) {
    res.json({
        "start_time": moment().subtract(process.uptime().toFixed(0), "seconds").toISOString(),
        "uptime": process.uptime()
    });
});

module.exports = router;
