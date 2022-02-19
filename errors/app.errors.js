exports.invalidUrlError = (req, res) => {
  res.status(404).send({ message: "Invalid URL Passed" });
};

exports.customErrors = (err, req, res, next) => {
  if (err.status) res.status(err.status).send({ message: err.message });
  else next(err);
};

exports.psqlErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ message: "Data entry error" });
  }
  if (err.code === "23503") {
    res.status(400).send({ message: "Article ID Does Not Exist" });
  } else next(err);
};

exports.serverErrors = (err, req, res, next) => {
  res.status(500).send({ message: "Server Error!" });
};
