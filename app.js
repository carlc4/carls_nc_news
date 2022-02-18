const express = require("express");
const { getUsers } = require("./controllers/users.controllers");
const { getTopics } = require("./controllers/topics.controllers");
const { deleteCommentById } = require("./controllers/comments.controllers");

const {
  getArticleById,
  patchArticleById,
  getArticles,
  getArticleComments,
  postArticleComment,
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

app.get("/api/articles/", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getArticleComments);

app.get("/api/users/", getUsers);

app.patch("/api/articles/:article_id", patchArticleById);

app.post("/api/articles/:article_id/comments", postArticleComment);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.all("/api/*", invalidUrlError);

app.use(customErrors);

app.use(psqlErrors);

app.use(serverErrors);

module.exports = app;
