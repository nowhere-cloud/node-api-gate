
"use strict";

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Syslog = require("../model/syslog-schema");
const qs = require("querystring");

/**
 * Mongoose Stuffs
 */
mongoose.connect(process.env.MONGODB_URI);
var db = mongoose.connection;

/**
 * Route Preprocess: Add JSON Header to reduce code dupe
 */
const pp_json_header = (req, res, next) => {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    next();
};

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
router.get("/all", pp_json_header, (req, res, next) => {
    let index = 0;
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

router.get("/id/all", pp_json_header, (req, res, next) => {
    Syslog.distinct("_id", (err, doc) => {
        if (err) return next(err);
        res.write(doc).end();
    });
});

router.get("/id/:id", pp_json_header, (req, res, next) => {
    let index = 0;
    let stream = Syslog.find({
        "_id": qs.escape(req.params.id)
    }).lean().cursor();
    stream.on("data", (doc) => {
        res.write(JSON.stringify(doc));
    });
    stream.on("close", () => {
        res.end();
    });
    stream.on("error", (err) => {
        return next(err);
    });
});

/**
 * Get Tags of entries in the Syalog Collection
 */
router.get("/tag/all", pp_json_header, (req, res, next) => {
    let index = 0;
    let stream = Syslog.distinct("tag").cursor();
    res.write("[");
    stream.on("data", (doc) => {
        res.write((!(index++) ? "" : ",") + doc);
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
 * GET records from Syslog Dataset by tag
 * http://stackoverflow.com/questions/6043847/how-do-i-query-for-distinct-values-in-mongoose
 */

router.get("/tag/:tag", pp_json_header, (req, res, next) => {
    let index = 0;
    let stream = Syslog.find({
        "tag": qs.escape(req.params.tag)
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
router.get("/hostname/all", pp_json_header, (req, res, next) => {
    let index = 0;
    let stream = Syslog.distinct("hostname").cursor();
    res.write("[");
    stream.on("data", (doc) => {
        res.write((!(index++) ? "" : ",") + doc);
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
 * GET records from Syslog Dataset by hostname
 */
router.get("/hostname/:hostname", pp_json_header, (req, res, next) => {
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
router.get("/facility/all", pp_json_header, (req, res, next) => {
    let index = 0;
    let stream = Syslog.distinct("facility").cursor();
    res.write("[");
    stream.on("data", (doc) => {
        res.write((!(index++) ? "" : ",") + doc);
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
 * GET records from Syslog Dataset by Syslog Facilities
 */
router.get("/facility/:facility", pp_json_header, (req, res, next) => {
    let index = 0;
    let stream = Syslog.find({
        "facility": qs.escape(req.params.facility)
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
