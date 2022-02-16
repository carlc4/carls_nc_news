const db = require("../db/connection");

exports.fetchUsers = async () => {
  const userResult = await db.query(`
  SELECT username
  FROM users;
  `);
  return userResult.rows;
};
