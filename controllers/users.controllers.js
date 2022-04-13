const { fetchUsers, fetchUserById, createUser } = require("../models/users.models");

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUsernameById = (req, res, next) => {
  const userId = req.params.username;
  fetchUserById(userId)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postUser = (req, res, next) => {
  const username = req.body.username
  const name = req.body.name
  const avatar_url = req.body.avatar_url
  createUser(username, name, avatar_url)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => {
      next(err);
    });
};