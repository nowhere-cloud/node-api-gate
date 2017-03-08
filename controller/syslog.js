"use strict";

const express = require("express");
const router = express.Router();
const uuid = require("uuid/v1");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const Syslog = require("../model/syslog-schema");

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
        // Remove useless Key from doc
        delete doc.wiredTiger;
        delete doc.indexDetails;
        // Render the result
        res.json(doc);
    });
});

/**
 * GET All Syslog Records
 */
router.get("/all", (req, res, next) => {
    let index = 0;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    let stream = Syslog.find({}, null, {
        sort: {
            "_id": -1
        }
    }).lean().cursor();
    stream.on("data", (doc) => {
        res.write((!(index++) ? "[" : ",") + JSON.stringify(doc));
    }).on("end", () => {
        res.write("]");
        res.end();
    }).on("error", (err) => {
        return next(err);
    });
});

/**
 * GET one record from Syslog Dataset
 * http://stackoverflow.com/questions/14992123/finding-a-mongodb-document-by-objectid-with-mongoose
 */
router.get("/:id", (req, res, next) => {
    Syslog.findOne({
        "_id": ObjectId.fromString(req.params.id)
    }, (err, doc) => {
        if (err) {
            res.write(err);
            return next(err);
        }
        res.write(doc);
    });
});

module.exports = router;
