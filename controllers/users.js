const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs"); //wrt Views folder
};

module.exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body.user;
    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Successfully Registered!");
      res.redirect("/listings");
    });
  } 
  catch (err) {
    req.flash("error", err.message);
    res.redirect("/users/signup"); //wrt to Root directory
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
  req.flash("success", "Welcome to wanderlust!");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You logged out!");
    res.redirect("/listings");
  });
}