const express = require("express");
const {
  getTopics,
  getArticleById,
  getUsers,
} = require("./controllers/app.controllers");
const {
  invalidUrlError,
  psqlErrors,
  serverErrors,
  customErrors,
} = require("./errors/app.errors");

const app = express();

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/users/", getUsers);

app.all("/api/*", invalidUrlError);

app.use(customErrors);

app.use(psqlErrors);

app.use(serverErrors);

module.exports = app;
