const express = require("express");
const app = express();
const commentsRouter = express.Router();
const {
  getComments,
  deleteCommentById,
  patchCommentsById,
} = require("../controllers/comments.controllers");
const { methodError } = require("../errors/app.errors");

commentsRouter
  .route("/:comment_id")
  .get(methodError)
  .post(methodError)
  .delete(deleteCommentById)
  .patch(patchCommentsById);

commentsRouter
  .route("/")
  .get(getComments)
  .patch(methodError)
  .post(methodError)
  .delete(methodError);

module.exports = commentsRouter;
