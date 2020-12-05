const express = require("express");
const router = express.Router();
const createError = require("http-errors");

const executeModel = require("./execute-model");

router.post("/", (req, res, next) => {
  if (!req.body || !req.body.data) {
    return next(createError(400, "Expected data to contain a data property"));
  }

  executeModel(req.body, (err, response) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: err.message });
    }

    res.json(response);
  });
});

module.exports = router;
