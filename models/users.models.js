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

exports.createUser = async (username, name, avatar_url) => {
  if (username === undefined || username === null ||
    name === undefined || name === null) {
    return Promise.reject({
      status: 400,
      message: "Please complete all fields",
    });
  }
  const userCreate = await db.query(
    `INSERT INTO users(username, name, avatar_url) 
  VALUES ($1, $2, $3) RETURNING *;`,
    [username, name, avatar_url]
  )
  return userCreate.rows[0]
}