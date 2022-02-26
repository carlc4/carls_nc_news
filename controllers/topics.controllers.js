const { fetchTopics, fetchTopicBySlug } = require("../models/topics.models");

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
