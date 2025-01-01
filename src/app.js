const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const app = express();

// Init middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Init database
require("./dbs/init.mongodb");

//  -- Check how many connections the system has? --
// const {checkOverload} = require('./helper/check.connect')
// checkOverload();

// Init routes
app.use("", require("./routes"));

// Hanling Error
app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
        status: "error",
        code: statusCode,
        stack: error.stack,
        message: error.message || "Internal Server Error",
    });
});

module.exports = app;
