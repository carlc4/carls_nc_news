const db = require("../db/connection");

exports.fetchTopics = async () => {
  const topicResult = await db.query(`
      SELECT *
      FROM topics;
      `);
  return topicResult.rows;
};

exports.fetchTopicBySlug = async (slug) => {
  if (slug === undefined || slug === "") {
    return Promise.reject({
      status: 400,
      message: "Bad request",
    });
  }

  const topicResult = await db.query(
    `
      SELECT *
      FROM topics
      WHERE slug = $1;`,
    [slug]
  );
  if (topicResult.rows.length === 0) {
    return Promise.reject({
      status: 400,
      message: "Topic does not exist",
    });
  } else return topicResult.rows;
};
