const db = require("../db/connection");

exports.fetchTopics = async () => {
  const topicResult = await db.query(`
      SELECT *
      FROM topics;
      `);
  return topicResult.rows;
};

exports.fetchUsers = async () => {
  const userResult = await db.query(`
  SELECT username
  FROM users;
  `);
  return userResult.rows;
};

exports.fetchArticleById = async (req) => {
  const articleId = req.params.article_id;
  const articleIdResult = await db.query(
    `SELECT * FROM articles WHERE article_id = $1;`,
    [articleId]
  );
  if (articleIdResult.rows.length === 0) {
    return Promise.reject({
      status: 404,
      message: "Article ID Does Not Exist!",
    });
  } else return articleIdResult.rows[0];
};
