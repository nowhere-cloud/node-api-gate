"use strict";

const express = require("express");
const router = express.Router();
const uuid = require("uuid/v1");
const mongoose = require("mongoose");
const Syslog = require("../model/syslog-schema");

/**
 * Mongoose Stuffs
 */
let db = null;
let co = false;

router.all("*", (req, res, next) => {
    mongoose.connect(process.env.MONGODB_URI);
    db = mongoose.connection;
    db.on("error", (err) => {
        return next(err);
    });
    db.once("open", () => {
        co = true;
        return next();
    });
});

router.get("/get/all", (req, res, next) => {
    if (co) {
        let stream = model.find({}).stream();
        stream.on("data", (doc) => {
            res.write(JSON.stringify(doc));
        }).on("close", () => {
            db.close();
            res.end();
        }).on("error", (err) => {
            db.close();
            return next(err);
        });
    } else {
        return next(error);
    }
});

router.get("/get/:id", (req, res, next) => {
    if (co) {
        let stream = model.findById(req.params.id).stream();
        stream.on("data", (doc) => {
            res.write(JSON.stringify(doc));
        }).on("close", () => {
            db.close();
            res.end();
        }).on("error", (err) => {
            db.close();
            return next(err);
        });
    } else {
        return next(error);
    }
});

module.exports = router;
