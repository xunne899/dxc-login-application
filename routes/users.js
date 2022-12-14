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
  const user = await User.collection().fetch();
  res.render("users/index", {
    user: user.toJSON(),
  });
});

router.get("/register", checkIfAuthenticated,(req, res) => {
  // display the registration form
  const registerForm = createRegistrationForm();
  res.render("users/register", {
    form: registerForm.toHTML(bootstrapField),
  });
});


router.post("/register", (req, res) => {
  const registerForm = createRegistrationForm();
  registerForm.handle(req, {
    success: async (form) => {
      const user = new User({
        name:form.data.name,
        role:form.data.role,
        username: form.data.username,
        password: getHashedPassword(form.data.password),
        email: form.data.email,
      });
      await user.save();
      req.flash("success_messages", "Signed up successfully!");
      res.redirect("/");
    },
    error: (form) => {
      res.render("users/register", {
        form: form.toHTML(bootstrapField),
      });
    },
  });
});

router.get("/:user_id/update",checkIfAuthenticated, async (req, res) => {
  const user = await dataLayer.getUserById(req.params.user_id);

  const userUpdateForm = createUserForm();

  userUpdateForm.fields.username.value = user.get("username");
  userUpdateForm.fields.email.value = user.get("email");

  res.render("users/update", {
    userUpdateForm: userUpdateForm.toHTML(bootstrapField),
    user: user.toJSON(),
  });
});

router.post("/:user_id/update", async (req, res) => {
  const user = await dataLayer.getUserById(req.params.user_id);
  const userUpdateForm = createUserForm();
  userUpdateForm.handle(req, {
    success: async (form) => {
      let { ...Data } = form.data;
      console.log(Data);
      user.set(Data);
      user.save();

      req.flash("success_messages", `User Successfully Updated`);
      res.redirect("/users");
    },

  });
});

router.get("/:user_id/delete",checkIfAuthenticated, async (req, res) => {
  const user = await dataLayer.getUserById(req.params.user_id);

  res.render("users/delete", {
    user: user.toJSON(),
  });
});

router.post("/:user_id/delete", async (req, res) => {
  const user = await dataLayer.getUserById(req.params.user_id);
  await user.destroy();
  res.redirect("/users");
});



router.get("/logout", (req, res) => {
  req.session.user = null;
  req.flash("success_messages", "Logout Successfully");
  res.redirect("/");
});
module.exports = router;