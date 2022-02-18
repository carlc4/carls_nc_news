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

exports.fetchArticles = async () => {
  const articleResult = await db.query(`
  SELECT articles.*, 
  COUNT (comments.article_id) AS comment_count
  FROM articles
  LEFT JOIN comments
  ON articles.article_id = comments.article_id 
  GROUP BY articles.article_id, comments.comment_id
  ORDER BY articles.created_at DESC`);
  return articleResult.rows;
};

exports.fetchArticleComments = async (id) => {
  const commentResult = await db.query(
    `SELECT comment_id, votes, created_at, author, body FROM comments
  WHERE article_id = $1;
  `,
    [id]
  );
  return commentResult.rows;
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

exports.sendArticleComment = async (articleID, username, comment) => {
  if (
    typeof comment !== "string" ||
    comment === undefined ||
    username === undefined
  ) {
    return Promise.reject({ status: 400, message: "Missing info" });
  }

  const registeredUser = await db.query(
    `SELECT * FROM USERS WHERE username = $1;`,
    [username]
  );
  if (registeredUser.rows.length === 0) {
    return Promise.reject({
      status: 404,
      message: "Username not found, please register first",
    });
  } else {
    const result = await db.query(
      `INSERT INTO comments(body, author, article_id) 
    VALUES ($1, $2, $3) RETURNING *;`,
      [comment, username, articleID]
    );
    return result.rows[0];
  }
};
