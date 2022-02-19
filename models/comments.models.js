const e = require("express");
const db = require("../db/connection");

exports.fetchComments = async () => {
  const commentResults = await db.query(
    `
          SELECT *
          FROM comments;
          `
  );
  return commentResults.rows;
};

exports.removeCommentById = async (commentId) => {
  if (!commentId || isNaN(commentId)) {
    return Promise.reject({
      status: 404,
      message: "Bad request",
    });
  }

  const commentCheck = await db.query(
    `
          SELECT *
          FROM comments
          WHERE comment_id = $1
          ;`,

    [commentId]
  );

  if (commentCheck.rows.length === 0) {
    return Promise.reject({
      status: 400,
      message: "Comment ID Does Not Exist!",
    });
  } else {
    const result = await db.query(
      `
          DELETE FROM comments
          WHERE comment_id = $1
          RETURNING *;`,

      [commentId]
    );
    return result.rows[0];
  }
};
