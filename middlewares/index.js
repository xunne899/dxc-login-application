const jwt = require("jsonwebtoken");

const checkIfAuthenticated = function (req, res, next) {
  const user = req.session.user;
  if (!user) {
    req.flash("error_messages", "Only Staff has access privilege");
    res.redirect("/");
  } else {
    next();
  }
};

const checkIfPermitted = function(req , res , next){
  const user = req.session.user
  if(user.role_id === 1){
      // req.flash('error_messages' , "Your account is not authorised to view this page, please use the correct account")
      res.render("users/index")
  }
  else{
    if(user.role_id === 2){
      // req.flash('error_messages' , "Your account is not authorised to view this page, please use the correct account")
      res.render("users/view")
   
  }
  next()
}
}
const checkIfAuthenticatedJWT = function (req, res, next) {

  const authHeader = req.headers.authorization;
  if (authHeader) {
    // extract out the JWT and check whether if it is valid
    // BEARER eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpvbnNub3ciLCJpZCI6MTQsImVtYWlsIjoiam9uc25vd0Bhc2QuY29tIiwiaWF0IjoxNjU5NDk4MTg2LCJleHAiOjE2NTk1MDE3ODZ9.ryIUoXSnhQuC3kTj9t-RxysaZYMv74J5tanu6onTQ30
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.TOKEN_SECRET, function (tokenerr, tokenData) {
      // err argument -- is null if there is no error
      // tokenData argument -- data embedded into the JWT as payload
      if (tokenerr) {
        res.status(401);
        res.json({
          error: "Invalid access token",
        });
      } else {
        // if the token is valid
        req.customer = tokenData;
        next();
      }
    });
  } else {
    res.status(401);
    res.json({
      error: "No authorization headers found",
    });
  }
};

module.exports = { checkIfAuthenticated, checkIfAuthenticatedJWT,checkIfPermitted  };