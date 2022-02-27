exports.invalidUrlError = (req, res) => {
  res.status(404).send({ message: "Invalid URL Passed" });
};

exports.customErrors = (err, req, res, next) => {
  if (err.status) res.status(err.status).send({ message: err.message });
  else next(err);
};

exports.psqlErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    console.log(err);
    res.status(400).send({ message: "Data entry error" });
  }
  if (err.code === "23503") {
    console.log(err);
    res.status(400).send({ message: "Bad Request" });
  } else next(err);
};

exports.serverErrors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ message: "Server Error!" });
};

exports.methodError = (req, res, next) => {
  res.status(405).send({ message: "Method not allowed on this route" });
};
