exports.invalidUrlError = (req, res) => {
  res.status(404).send({ msg: "Invalid URL Passed" });
};

exports.customErrors = (err, req, res, next) => {
  if (err.status)
    res.status(err.status).send({ message: "Article ID Does Not Exist!" });
  else next(err);
};

exports.psqlErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ message: "Data entry error" });
  } else next(err);
};

exports.serverErrors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Server Error!" });
};
