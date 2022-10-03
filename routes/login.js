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

const { createLoginForm, bootstrapField } = require("../forms");

router.get("/", (req, res) => {
  const loginForm = createLoginForm();
  res.render("login/index", {
    form: loginForm.toHTML(bootstrapField),
  });
});

router.post("/", async function (req, res) {
  const loginForm = createLoginForm();
  loginForm.handle(req, {
    success: async function (form) {
      const user = await User.where({
        email: form.data.email,
        password: form.data.password,
      }).fetch({
        require: false,
      });

      // check the user does not exist
      if (!user) {
        req.flash("error_messages", "Invalid credentials. Please retry again.");
        res.redirect("/");
      } else {
        //check the password matches
        if (user.get("password") === form.data.password && user.get("role") === "manager" ) {
          req.session.user = {
            id: user.get("id"),
            username: user.get("username"),
            email: user.get("email"),
           
          };
          res.redirect("/users");

        } 
         else if (user.get("password") === form.data.password && user.get("role") == "user" ) {
            req.session.user = {
              id: user.get("id"),
              username: user.get("username"),
              email: user.get("email"),
              // role_id:user.get("role_id")
            };
            res.redirect("/profile");
  
          } 
        
        else {
          req.flash("error_messages", "Invalid username or password. Please retry again.");
          res.redirect("/");
        }
      }
    },
    error: (form) => {
      req.flash("error_messages", "Error logging in. Please re-enter again");
      res.render("login/index", {
        form: form.toHTML(bootstrapField),
      });
    },
  });
});

module.exports = router;
