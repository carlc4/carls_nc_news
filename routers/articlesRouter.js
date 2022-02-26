const express = require("express");
const app = express();
const articlesRouter = express.Router();
const {
  getArticleById,
  patchArticleById,
  getArticles,
  getArticleComments,
  postArticleComment,
  postArticles,
} = require("../controllers/articles.controllers");
const { methodError } = require("../errors/app.errors");

articlesRouter
  .route("/")
  .get(getArticles)
  .post(postArticles)
  .patch(methodError)
  .delete(methodError);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .post(methodError)
  .patch(patchArticleById)
  .delete(methodError);

articlesRouter
  .route("/:article_id/comments")
  .get(getArticleComments)
  .post(postArticleComment)
  .patch(methodError)
  .delete(methodError);

module.exports = articlesRouter;
