const express = require("express");
const app = express();
const commentsRouter = express.Router();
const {
  getComments,
  deleteCommentById,
  patchCommentsById,
} = require("../controllers/comments.controllers");
// const methodError = require("../errors/app.errors");

commentsRouter
  .route("/:comment_id")
  .delete(deleteCommentById)
  .patch(patchCommentsById);
//   .all(methodError);

commentsRouter.route("/").get(getComments);
//   .patch(methodError)
//   .all(methodError);
//   .delete(methodError)

module.exports = commentsRouter;