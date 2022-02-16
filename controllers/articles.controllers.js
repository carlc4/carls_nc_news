const {
  fetchArticleById,
  sendArticleVotesById,
} = require("../models/articles.models.js");

exports.getArticleById = (req, res, next) => {
  fetchArticleById(req)
    .then((singleArticle) => {
      return res.status(200).send({ articles: singleArticle });
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
      res.status(200).send({ updatedArticle: response });
    })
    .catch((err) => {
      next(err);
    });
};
