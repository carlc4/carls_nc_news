const express = require("express");
const app = express();
const usersRouter = express.Router();
const {
  getUsers,
  getUsernameById,
} = require("../controllers/users.controllers");
const { methodError } = require("../errors/app.errors");

usersRouter
  .route("/")
  .get(getUsers)
  .patch(methodError)
  .post(methodError)
  .delete(methodError);

usersRouter.route("/:username").get(getUsernameById);

module.exports = usersRouter;
