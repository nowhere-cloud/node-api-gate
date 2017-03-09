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
            $natural: -1
        }
    }).lean().cursor();
    res.write("[");
    stream.on("data", (doc) => {
        res.write((!(index++) ? "" : ",") + JSON.stringify(doc));
    });
    stream.on("close", () => {
        res.write("]");
        res.end();
    });
    stream.on("error", (err) => {
        return next(err);
    });
});

/**
 * GET one record from Syslog Dataset
 * http://stackoverflow.com/questions/14992123/finding-a-mongodb-document-by-objectid-with-mongoose
 * FIXME
 */

/*
router.get("/id/:id", (req, res, next) => {
    Syslog.findOne({ "_id": ObjectId("58c0f71ca891a2000f27c30e") }, (err, doc) => {
        if (err) {
            return next(err);
        }
        res.write(doc);
    });
});
*/

/**
 * Get Tags of entries in the Syalog Collection
 */
router.get("/tag/all", (req, res, next) => {
    Syslog.distinct("tag", (err, doc) => {
        if (err) return next(err);
        res.json(doc);
    });
});

/**
 * GET records from Syslog Dataset by tag
 * http://stackoverflow.com/questions/6043847/how-do-i-query-for-distinct-values-in-mongoose
 */

router.get("/tag/:tag", (req, res, next) => {
    let index = 0;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    let stream = Syslog.find({
        "tag": req.params.tag
    }, null, {
        sort: {
            $natural: -1
        }
    }).lean().cursor();
    res.write("[");
    stream.on("data", (doc) => {
        res.write((!(index++) ? "" : ",") + JSON.stringify(doc));
    });
    stream.on("close", () => {
        res.write("]");
        res.end();
    });
    stream.on("error", (err) => {
        return next(err);
    });
});

/**
 * Get Tags of entries in the Syalog Collection
 */
router.get("/hostname/all", (req, res, next) => {
    Syslog.distinct("hostname", (err, doc) => {
        if (err) return next(err);
        res.json(doc);
    });
});

/**
 * GET records from Syslog Dataset by hostname
 */
router.get("/hostname/:hostname", (req, res, next) => {
    let index = 0;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    let stream = Syslog.find({
        "hostname": req.params.hostname
    }, null, {
        sort: {
            $natural: -1
        }
    }).lean().cursor();
    res.write("[");
    stream.on("data", (doc) => {
        res.write((!(index++) ? "" : ",") + JSON.stringify(doc));
    });
    stream.on("close", () => {
        res.write("]");
        res.end();
    });
    stream.on("error", (err) => {
        return next(err);
    });
});

/**
 * Get Facilities of entries in the Syalog Collection
 */
router.get("/facility/all", (req, res, next) => {
    Syslog.distinct("facility", (err, doc) => {
        if (err) return next(err);
        // Distinct does not allow sorting, manual interpretion is needed.
        res.json(doc.sort((a, b) => {
            return a - b;
        }));
    });
});

/**
 * GET records from Syslog Dataset by Syslog Facilities
 */
router.get("/facility/:facility", (req, res, next) => {
    let index = 0;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    let stream = Syslog.find({
        "facility": req.params.facility
    }, null, {
        sort: {
            $natural: -1
        }
    }).lean().cursor();
    res.write("[");
    stream.on("data", (doc) => {
        res.write((!(index++) ? "" : ",") + JSON.stringify(doc));
    });
    stream.on("close", () => {
        res.write("]");
        res.end();
    });
    stream.on("error", (err) => {
        return next(err);
    });
});


module.exports = router;
