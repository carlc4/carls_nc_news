const e = require("express");
const db = require("../db/connection");

exports.fetchArticleById = async (req) => {
  const articleId = req.params.article_id;
  const articleIdResult = await db.query(
    `
  SELECT *,
  COUNT(comments.article_id) AS comment_count
  FROM articles 
  LEFT JOIN comments
  ON articles.article_id = comments.article_id 
  WHERE articles.article_id = $1
  GROUP BY articles.article_id, comments.comment_id
  ;`,
    [articleId]
  );
  if (articleIdResult.rows.length === 0) {
    return Promise.reject({
      status: 404,
      message: "Article ID Does Not Exist!",
    });
  } else return articleIdResult.rows[0];
};

exports.sendArticleVotesById = async (articleId, votes) => {
  if (votes === undefined || votes.length === 0) {
    return Promise.reject({
      status: 400,
      message: "Article ID Does Not Exist!",
    });
  }

  const result = await db.query(
    `
      UPDATE articles
      SET votes = votes + $1
      WHERE article_id = $2
      RETURNING *;`,
    [votes, articleId]
  );

  if (result.rows[0] === undefined) {
    return Promise.reject({
      status: 404,
      message: "Article ID Does Not Exist!",
    });
  } else return result.rows[0];
};
