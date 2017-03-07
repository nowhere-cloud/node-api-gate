
"use strict";

const express = require("express");
// const path = require("path");
// const favicon = require("serve-favicon");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const index = require("./controller/index");
const syslog = require("./controller/syslog");

const app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Namespacing
app.use("/", index);
app.use("/syslog", syslog);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    let err = new Error("Not Found");
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500).json(res.locals.error);
});

module.exports = app;
