const express = require("express");
const { getTopics } = require("./controllers/app.controllers");
const { invalidUrlError } = require("./errors/app.errors");

const app = express();

app.get("/api/topics", getTopics);

app.get("/api/*", invalidUrlError);

module.exports = app;
