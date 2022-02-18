const e = require("express");
const db = require("../db/connection");

exports.removeCommentById = async (commentId) => {
  const result = await db.query(
    `
          DELETE FROM comments
          WHERE comment_id = $1
          RETURNING *;`,

    [commentId]
  );
  return result.rows[0];
};
