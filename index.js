const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
const helpers = require("handlebars-helpers")({
  handlebars: hbs.handlebars,
});
const cors = require("cors");
const session = require("express-session");
const flash = require("connect-flash");
const FileStore = require("session-file-store")(session);
const csrf = require("csurf");
require("dotenv").config();

const app = express();

app.set("view engine", "hbs");

app.use(express.static("public"));

wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");

const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use(
  session({
    store: new FileStore(),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(flash());

app.use(function (req, res, next) {
  res.locals.success_messages = req.flash("success_messages");
  res.locals.error_messages = req.flash("error_messages");
  next();
});

const csrfInstance = csrf();
app.use(function (req, res, next) {
  if (req.url === "/checkout/process_payment" || req.url.slice(0, 5) == "/api/") {
    next();
  } else {
    csrfInstance(req, res, next);
  }
});

app.use(function (err, req, res, next) {
  if (err && err.code === "EBADCSRFTOKEN") {
    req.flash("error_messages", "The form has expired. Please try again");

    res.redirect("back");
  } else {
    next();
  }
});

app.use(function (req, res, next) {
  if (req.csrfToken) {
    res.locals.csrfToken = req.csrfToken();
  }
  next();
});

// app.use(function (req, res, next) {
//   res.locals.user = req.session.user;
//   next();
// });

// const express = require("express");
// const hbs = require("hbs");
// const wax = require("wax-on");
// const helpers = require("handlebars-helpers")({
//   handlebars: hbs.handlebars,
// });

// require("dotenv").config();

// const app = express();

// app.set("view engine", "hbs");

// //static folder
// app.use(express.static("public"));

// // setup wax-on
// wax.on(hbs.handlebars);
// wax.setLayoutPath("./views/layouts");

// //enable forms
// app.use(
//   express.urlencoded({
//     extended: false,
//   })
// );

// async function main(){
// app.get('/',(req,res)=>{
//     res.send("Its's alive !")
// })
// }

// main()
const { checkIfPermitted } = require("./middlewares");
const loginPage = require("./routes/login");
const userPage = require("./routes/users");
const profilePage = require("./routes/profile");
app.use("/", loginPage);
app.use("/users", userPage);
app.use("/profile", profilePage);

// Share the user data with hbs files
app.use(function (req, res, next) {
  res.locals.user = req.session.user;
  next();
});

app.listen(3000, () => {
  console.log("Server Started");
});
