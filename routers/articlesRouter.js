const express = require("express");
const app = express();
const articlesRouter = express.Router();
const {
  getArticleById,
  patchArticleById,
  getArticles,
  getArticleComments,
  postArticleComment,
} = require("../controllers/articles.controllers");
// const methodError = require("../errors/app.errors");

articlesRouter.route("/").get(getArticles);
//   .post(methodError)
//   .patch(methodError)
//   .all(methodError);
//   .delete(methodError)

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById);
//   .delete(deleteCommentById);
//   .post(methodError)
//   .all(methodError);

articlesRouter
  .route("/:article_id/comments")
  .get(getArticleComments)
  .post(postArticleComment);
//   .patch(patchArticleById);
//   .delete(deleteCommentById);
//   .all(methodError);

module.exports = articlesRouter;
