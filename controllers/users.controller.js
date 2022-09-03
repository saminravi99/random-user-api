//dependencies

const data = require("../lib/data");
const { parseJsonToObject } = require("../utils/parseJSON");
const photoValidator = require("../utils/photoValidator");
const uniqid = require("uniqid");
const generateID = require("../utils/generateID");

//module scaffolding
const controller = {};

controller.getRandomUser = (req, res, next) => {
  data.read("users", "users", (err, users) => {
    if (!err && Array.isArray(users) && users.length > 0) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      res.status(200).json({
        success: true,
        message: "Random User",
        randomUser,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Internal server error. No users found",
      });
    }
  });
};

controller.getAllUsers = (req, res, next) => {
  const { limit } = req.query;
  data.read("users", "users", (err, users) => {
    if (!err && Array.isArray(users) && users.length > 0) {
      if (limit) {
        const limitedUsers = users.slice(0, Number(limit));
        res.status(200).json({
          success: true,
          message: "Limited Users",
          limitedUsers,
        });
      } else {
        res.status(200).json({
          success: true,
          message: "All Users",
          users,
        });
      }
    } else {
      res.status(500).json({
        success: false,
        message: "Internal server error. No users found",
      });
    }
  });
};

controller.postUser = (req, res, next) => {
  if (typeof req.body === "object" && Array.isArray(req.body) === false) {
    const { gender, name, contact, address, photoURL } = req.body;

    const userGender =
      typeof gender === "string" &&
      gender.trim().length > 0 &&
      (gender.toLocaleLowerCase() === "male" ||
        gender.toLocaleLowerCase() === "female" ||
        gender.toLocaleLowerCase() === "other")
        ? gender
        : false;

    const userName =
      typeof name === "string" && name.trim().length > 0 ? name : false;

    const userContact =
      typeof contact === "number" && contact.toString().trim().length === 11
        ? contact
        : false;

    const userAddress =
      typeof address === "string" && address.trim().length > 0 ? address : false;

    const userPhotoURL =
      typeof photoURL === "string" && photoURL.trim().length > 0
        ? photoURL
        : false;
    if (userGender && userName && userContact && userAddress && userPhotoURL) {
        let userObject = {
          _id: generateID(5),
          name: userName,
          gender:
            userGender.charAt(0).toUpperCase() +
            userGender.slice(1).toLocaleLowerCase(),
          contact: userContact,
          address: userAddress,
          photoURL: userPhotoURL,
        };
      data.create("users", "users", userObject, (err) => {
        if (!err) {
          res.status(201).json({
            success: true,
            message: "User created successfully",
            userObject,
          });
        } else {
          res.status(500).json({
            success: false,
            message: "Internal server error. User not created",
            err
          });
        }
      });
    }
    else{
        res.status(500).json({
            success: false,
            message: "Internal server error. User not created. Missing required fields",
        });
    }
  } else {
    res.status(400).json({
      success: false,
      message: "Invalid request body",
    });
  }
};

//export module
module.exports = controller;
