const { removeCommentById } = require("../models/comments.models");

exports.deleteCommentById = (req, res, next) => {
  const commentId = req.params.comment_id;
  removeCommentById(commentId)
    .then((response) => {
      return res.status(200).send({ response });
    })
    .catch((err) => {
      next(err);
    });
};
