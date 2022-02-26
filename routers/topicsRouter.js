const express = require("express");
const app = express();
const topicsRouter = express.Router();
const { getTopics } = require("../controllers/topics.controllers");
const { methodError } = require("../errors/app.errors");

topicsRouter
  .route("/")
  .get(getTopics)
  .patch(methodError)
  .delete(methodError)
  .post(methodError);

module.exports = topicsRouter;
