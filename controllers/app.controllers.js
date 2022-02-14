const { fetchTopics } = require("../models/app.models");

exports.getTopics = (req, res) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send(topics);
    })
    .catch((err) => {
      res.status(500).send({ msg: "Server Error!" });
    });
};
