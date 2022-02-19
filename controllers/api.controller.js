const json = require("../endpoints.json");

exports.apiJson = (req, res, next) => {
  res.status(200).send(json);
};
