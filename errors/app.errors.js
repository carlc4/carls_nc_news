exports.invalidUrlError = (req, res) => {
  res.status(404).send({ msg: "Invalid URL Passed" });
};
