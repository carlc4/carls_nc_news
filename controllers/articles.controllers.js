const {
  fetchArticleById,
  sendArticleVotesById,
  fetchArticles,
  fetchArticleComments,
  sendArticleComment,
  sendArticle,
} = require("../models/articles.models.js");

exports.getArticleById = (req, res, next) => {
  fetchArticleById(req.params.article_id)
    .then((singleArticle) => {
      return res.status(200).send({ article: singleArticle });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  const sortBy = req.query.sort_by;
  const order = req.query.order;
  const topic = req.query.topic;

  fetchArticles(sortBy, order, topic)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleComments = (req, res, next) => {
  const articleID = req.params.article_id;
  fetchArticleComments(articleID)
    .then((articleComments) => {
      res.status(200).send({ comments: articleComments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleById = (req, res, next) => {
  const articleID = req.params.article_id;
  const votes = req.body.inc_votes;
  sendArticleVotesById(articleID, votes)
    .then((response) => {
      res.status(200).send({ article: response });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postArticleComment = (req, res, next) => {
  const articleID = req.params.article_id;
  const username = req.body.username;
  const comment = req.body.comment;

  sendArticleComment(articleID, username, comment)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postArticles = (req, res, next) => {
  const author = req.body.author;
  const title = req.body.title;
  const body = req.body.body;
  const topic = req.body.topic;

  sendArticle(author, title, body, topic)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
