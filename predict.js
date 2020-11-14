const express = require("express");
const router = express.Router();
const createError = require("http-errors");

const executeModel = require("./execute-model");

router.post("/", (req, res, next) => {
  if (!Array.isArray(req.body)) {
    return next(createError(400, "Expected a json array to be passed in POST body"));
  }

  executeModel(req.body, (err, response) => {
    if (err) {
      return next(createError(500, err));
    }

    res.json(response);
  });
});

module.exports = router;
