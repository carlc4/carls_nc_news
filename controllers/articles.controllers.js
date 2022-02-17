const {
  fetchArticleById,
  sendArticleVotesById,
  fetchArticles,
  fetchArticleComments,
} = require("../models/articles.models.js");

exports.getArticleById = (req, res, next) => {
  fetchArticleById(req)
    .then((singleArticle) => {
      return res.status(200).send({ article: singleArticle });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  fetchArticles()
    .then((articleList) => {
      res.status(200).send({ articles: articleList });
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
