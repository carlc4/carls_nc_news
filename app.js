const express = require("express");
const app = express();
app.use(express.json());

const {
  invalidUrlError,
  psqlErrors,
  serverErrors,
  customErrors,
} = require("./errors/app.errors");

const apiRouter = require("./routers/apiRouter");

app.use("/api", apiRouter);

app.all("/api/*", invalidUrlError);

app.use(customErrors);

app.use(psqlErrors);

app.use(serverErrors);

module.exports = app;
