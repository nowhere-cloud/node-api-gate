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

router.get("/*", (req, res, next) => {
    res.header("X-Timestamp", Date.now());
    next();
});

/**
 * GET All Syslog Records
 */
router.get("/", pp_json_header, (req, res, next) => {
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
 * NOTE: These two endpoint is buggy, caring required.
 */

router.get("/id", (req, res, next) => {
    Syslog.distinct("_id", (err, doc) => {
        if (err) return next(err);
        res.json(doc);
    });
});

router.get("/id/:id", (req, res, next) => {
    Syslog.findOne({
        "_id": qs.escape(req.params.id)
    }, (err, doc) => {
        if (err) return next(err);
        res.json(doc);
    });
});

/**
 * Get Tags of entries in the Syalog Collection
 * http://stackoverflow.com/questions/6043847/how-do-i-query-for-distinct-values-in-mongoose
 */
router.get("/tag", (req, res, next) => {
    Syslog.distinct("tag", null, (err, doc) => {
        if (err) return next(err);
        res.json(doc);
    });
});

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
 * GET records from Syslog Dataset by hostname
 */
router.get("/hostname", (req, res, next) => {
    Syslog.distinct("hostname", null, (err, doc) => {
        if (err) return next(err);
        res.json(doc);
    });
});

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
router.get("/facility", (req, res, next) => {
    Syslog.distinct("facility", null, (err, doc) => {
        if (err) return next(err);
        res.json(doc);
    });
});

router.get("/facility/:facility/:rule?", pp_json_header, (req, res, next) => {
    let index = 0;
    let stream = Syslog.find({
        "facility": () => {
            switch (qs.escape(req.params.rule)) {
            case "lt":
                return { $lt: qs.escape(req.params.facility) };
            case "gt":
                return { $lt: qs.escape(req.params.facility) };
            default:
                return qs.escape(req.params.facility);
            }
        }
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
 * Get Serverity of entries in the Syalog Collection
 */
router.get("/severity", (req, res, next) => {
    Syslog.distinct("severity", null, (err, doc) => {
        if (err) return next(err);
        res.json(doc);
    });
});

router.get("/severity/:severity/:rule?", pp_json_header, (req, res, next) => {
    let index = 0;
    let stream = Syslog.find({
        "severity": () => {
            switch (qs.escape(req.params.rule)) {
            case "lt":
                return { $lt: qs.escape(req.params.severity) };
            case "gt":
                return { $lt: qs.escape(req.params.severity) };
            default:
                return qs.escape(req.params.severity);
            }
        }
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
 * GET DB Stat as Status Check
 */
router.get("/stats", (req, res, next) => {
    Syslog.collection.stats((err, doc) => {
        if (err) return next(err);
        // Remove useless Key from doc
        delete doc.wiredTiger;
        delete doc.indexDetails;
        // Render the result
        res.json(doc);
    });
});

module.exports = router;
