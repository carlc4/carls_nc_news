const e = require("express");
const db = require("../db/connection");
const { fetchUserById } = require("./users.models");
const { fetchTopicBySlug } = require("./topics.models");

exports.fetchArticleById = async (articleId) => {
  const articleIdResult = await db.query(
    `
  SELECT articles.*,
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

exports.fetchArticles = async (
  limit = 10,
  p = 1,
  sort_by = "created_at",
  order = "desc",
  topic
) => {
  if (
    ![
      "title",
      "topic",
      "author",
      "body",
      "created_at",
      "votes",
      "comment_count",
    ].includes(sort_by)
  ) {
    return Promise.reject({ status: 400, message: "Invalid sort query" });
  }
  if (!["asc", "desc"].includes(order)) {
    return Promise.reject({ status: 400, message: "Invalid order query" });
  }
  if (isNaN(p)) {
    return Promise.reject({ status: 400, message: "Invalid page query" });
  }
  if (isNaN(limit)) {
    return Promise.reject({ status: 400, message: "Invalid limit query" });
  }

  const offset = (p - 1) * limit;

  topicArray = [];
  let sqlQuery = `SELECT articles.*, COUNT (comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id`;

  if (topic) {
    const topicResult = await db.query(
      `SELECT * FROM topics WHERE slug = $1;`,
      [topic]
    );
    if (topicResult.rows.length === 0) {
      return Promise.reject({ status: 404, message: "Topic does not exist" });
    }
    const articleLookup = await db.query(
      `SELECT * FROM articles WHERE topic = $1;`,
      [topic]
    );
    if (articleLookup.rows.length === 0) {
      return Promise.reject({
        status: 404,
        message: "Topic has no matching articles",
      });
    }
    topicArray.push(topic);
    sqlQuery += ` WHERE topic = $1 `;
  }

  sqlQuery += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order} LIMIT ${limit} OFFSET ${offset}`;
  sqlQuery += ";";
  const articleResult = await db.query(sqlQuery, topicArray);
  return articleResult.rows;
};

exports.fetchArticleComments = async (id, limit = 10, p = 1) => {
  if (isNaN(limit) || isNaN(p)) {
    return Promise.reject({
      status: 400,
      message: "Query parameters invalid",
    });
  }
  const offset = (p - 1) * limit;
  const commentResult = await db.query(
    `SELECT comment_id, votes, created_at, author, body FROM comments
  WHERE article_id = $1 LIMIT $2 OFFSET $3;
  `,
    [id, limit, offset]
  );
  return commentResult.rows;
};

exports.sendArticle = async (author, title, body, topic) => {
  if (
    title === undefined ||
    body === undefined ||
    body.length === 0 ||
    topic === undefined
  ) {
    return Promise.reject({
      status: 400,
      message: "Please complete all fields",
    });
  }
  const topicCheck = await fetchTopicBySlug(topic);
  const userCheck = await fetchUserById(author);

  const result = await db.query(
    `INSERT INTO articles (title, topic, body, author)
    VALUES ($1, $2, $3, $4) RETURNING article_id;`,
    [title, topic, body, author]
  );

  const articleId = result.rows[0].article_id;
  const returnedArticle = await exports.fetchArticleById(articleId);
  return returnedArticle;
};
// };

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
