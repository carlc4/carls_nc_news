const express = require("express");
const app = express();
const usersRouter = express.Router();
const { getUsers } = require("../controllers/users.controllers");
// const methodError = require("../errors/app.errors");

usersRouter.route("/").get(getUsers);
//   .patch(methodError)
//   .all(methodError);
//   .delete(methodError)

module.exports = usersRouter;
