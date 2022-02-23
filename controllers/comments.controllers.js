const {
  removeCommentById,
  fetchComments,
  patchComment,
} = require("../models/comments.models");

exports.getComments = (req, res, next) => {
  fetchComments()
    .then((comments) => {
      return res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteCommentById = (req, res, next) => {
  const commentId = req.params.comment_id;
  removeCommentById(commentId)
    .then((response) => {
      return res.status(204).send({ response });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchCommentsById = (req, res, next) => {
  const commentId = req.params.comment_id;
  const votes = req.body.inc_votes;
  patchComment(commentId, votes)
    .then((comment) => {
      return res.status(200).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};
