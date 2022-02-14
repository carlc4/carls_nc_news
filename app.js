const express = require("express");
const { getTopics } = require("./controllers/app.controllers");

const app = express();

app.get("/api/topics", getTopics);

app.get("/api/*", (req, res) => {
  res.status(404).send({ msg: "Invalid URL Passed" });
});

module.exports = app;
