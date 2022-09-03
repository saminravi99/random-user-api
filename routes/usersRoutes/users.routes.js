//dependencies
const express = require("express");
const { getRandomUser, getAllUsers, postUser } = require("../../controllers/users.controller");

//module scaffolding
const usersRoutes = express.Router();

//routes
usersRoutes.route("/user/random").get(getRandomUser);
usersRoutes.route("/user/all").get(getAllUsers);
usersRoutes.route("/user/save").post(postUser);

//export module
module.exports = usersRoutes;
