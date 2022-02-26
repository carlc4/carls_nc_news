const {
  fetchTopics,
  fetchTopicBySlug,
  addTopic,
} = require("../models/topics.models");

exports.getTopics = (req, res, next) => {
  if (req.body.slug) {
    fetchTopicBySlug(req.body.slug)
      .then((topics) => {
        return res.status(200).send({ topics });
      })
      .catch((err) => {
        next(err);
      });
  } else
    fetchTopics()
      .then((topics) => {
        res.status(200).send({ topics });
      })
      .catch((err) => {
        next(err);
      });
};

exports.postTopics = (req, res, next) => {
  const slug = req.body.slug;
  const description = req.body.description;

  addTopic(slug, description)
    .then((topic) => {
      res.status(200).send({ topic });
    })
    .catch((err) => {
      next(err);
    });
};
