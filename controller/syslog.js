"use strict";

const express = require("express");
const router = express.Router();
const uuid = require("uuid/v1");
const mongoose = require("mongoose");
const schema = require("../model/syslog-schema");
const model = mongoose.model("Syslog", schema.schema);

/**
 * Mongoose Stuffs
 */

router.get("/get/all", (req, res, next) => {
    mongoose.connect(process.env.MONGODB_URI);
    mongoose.connection.on("error", (error) => {
        next(error);
    }).once("open", () => {
        model.find({}).cursor().on("data", (doc) => {
            res.write(JSON.stringify(doc));
        }).on("end", () => {
            mongoose.connection.close();
            res.end();
        }).on("error", (error) => {
            mongoose.connection.close();
            next(error);
        });
    });
});

router.get("/get/:id", (req, res, next) => {
    mongoose.connect(process.env.MONGODB_URI);
    mongoose.connection.on("error", (error) => {
        next(error);
    }).once("open", () => {
        model.findOne({
            _id: req.params.id
        }).cursor().on("data", (doc) => {
            res.write(JSON.stringify(doc));
        }).on("end", () => {
            mongoose.connection.close();
            res.end();
        }).on("error", (error) => {
            mongoose.connection.close();
            next(error);
        });
    });
});

module.exports = router;
