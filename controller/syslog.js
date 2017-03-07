"use strict";

const express = require("express");
const router = express.Router();
const uuid = require("uuid/v1");
const mongoose = require("mongoose");
const Syslog = require("../model/syslog-schema");
const helper_transfn = require("../helper/mongoose-stream-transform");

/**
 * Mongoose Stuffs
 */
mongoose.connect(process.env.MONGODB_URI);
var db = mongoose.connection;

/**
 * GET DB Stat as Status Check
 */
router.get("/", (req, res, next) => {
    Syslog.collection.stats((err, doc) => {
        if (err) return next(err);
        res.json(doc);
    });
});

/**
 * GET All Syslog Records
 */
router.get("/all", (req, res, next) => {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    let stream = Syslog.find({}).lean().cursor(helper_transfn);
    res.write("[");
    stream.pipe(res).on("end", res.write("]")).on("error", (err) => {
        return next(err);
    });
});

/**
 * GET one record from Syslog Dataset
 */
router.get("/:id", (req, res, next) => {
    Syslog.findOne({ _id: req.params.id }, (err, doc) => {
        if (err) return next(err);
        res.json(doc);
    });
});

module.exports = router;
