const db = require("../db/connection");

exports.fetchTopics = async () => {
  const topicResult = await db.query(`
      SELECT *
      FROM topics;
      `);
  return topicResult.rows;
};
