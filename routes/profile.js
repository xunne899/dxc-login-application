const express = require("express");
const router = express.Router();
const crypto = require("crypto");

const getHashedPassword = (password) => {
  const sha256 = crypto.createHash("sha256");
  const hash = sha256.update(password).digest("base64");
  return hash;
};
// import in User Model

const { User } = require("../models");
const dataLayer = require("../dal/users");
const { createRegistrationForm, createLoginForm, createUserForm, bootstrapField } = require("../forms");
const { checkIfAuthenticated } = require("../middlewares");

router.get("/", checkIfAuthenticated, async (req, res) => {
  const users = await User.collection().fetch();
  res.render("users/view", {
    users: users.toJSON(),
  });
});

module.exports = router;