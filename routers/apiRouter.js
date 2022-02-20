const express = require("express");
const articleRouter = require("./articlesRouter");
const commentsRouter = require("./commentsRouter");
const topicsRouter = require("./topicsRouter");
const usersRouter = require("./usersRouter");
const apiJson = require("../controllers/api.controller");
const apiRouter = express.Router();

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/articles", articleRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/users", usersRouter);
// apiRouter.route("/").get(apiJson); <<< this needs to be fixed

module.exports = apiRouter;
