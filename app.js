const express = require("express");
const { getUsers } = require("./controllers/users.controllers");
const { getTopics } = require("./controllers/topics.controllers");

const {
  getArticleById,
  patchArticleById,
} = require("./controllers/articles.controllers");

const {
  invalidUrlError,
  psqlErrors,
  serverErrors,
  customErrors,
} = require("./errors/app.errors");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/users/", getUsers);

app.patch("/api/articles/:article_id", patchArticleById);

app.all("/api/*", invalidUrlError);

app.use(customErrors);

app.use(psqlErrors);

app.use(serverErrors);

module.exports = app;
