const db = require("../db/connection");

exports.fetchUsers = async () => {
  const userResult = await db.query(`
  SELECT username
  FROM users;
  `);
  return userResult.rows;
};

exports.fetchUserById = async (id) => {
  const userInfo = await db.query(
    `
  SELECT *
  FROM users
  WHERE username = $1;
  `,
    [id]
  );
  if (userInfo.rows.length === 0) {
    return Promise.reject({ status: 400, message: "User does not exist" });
  } else return userInfo.rows[0];
};
