const {
  fetchTopics,
  fetchArticleById,
  fetchUsers,
} = require("../models/app.models");

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

// exports.getUsers = (req, res, next) => {
//   fetchUsers().then((users) => {
//     res.status(200).send({ users });
//   });
// };

exports.getArticleById = (req, res, next) => {
  fetchArticleById(req)
    .then((singleArticle) => {
      return res.status(200).send({ articles: singleArticle });
    })
    .catch((err) => {
      next(err);
    });
};
