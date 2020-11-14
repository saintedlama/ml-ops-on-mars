const createError = require("http-errors");
const express = require("express");
const logger = require("morgan");

const predict = require("./predict");

const app = express();

app.use(logger("dev"));
app.use(express.json());

app.use("/predict", predict);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: process.env.NODE_EN === "development" ? err : {},
  });
});

module.exports = app;
