if(process.env.NODE_ENV !== "production") {
  require('dotenv').config()
};
// require('dotenv').config()
// 👉 reads .env
// 👉 puts values into process.env

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const listingsRouter = require("./routes/listing");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js"); 

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}
//View engine = jo HTML banata ho
//“app.set() runs when the Express app initializes, not per request. It configures application settings before handling any requests.”

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");  // 👉 EJS ka kaam: data + template → final HTML Yes, EJS is a view engine used with Express to generate dynamic HTML using templates.
app.set("views", path.join(__dirname, "views")); // It tells Express: “All my HTML templates are inside the views folder.”

//Middleware
app.use(express.urlencoded({ extended: true })); //“Convert URL-encoded form data into a JavaScript object”
app.use(methodOverride("_method"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const sessionOptions = {
  secret: "mysecretkey",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expire: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

//Home
// app.get("/", (req, res) => {
//   res.send("Hi, I am root");
// });

app.use(session(sessionOptions)); // Ye middleware server par session system ON karta hai, browser se aayi cookie (sid) ko read karta hai, us sid se server ka session data nikaalta/banata hai, aur us data ko req.session me attach kar deta hai.
app.use(flash());
app.use(passport.initialize()); // Passport ko activate karta hai taaki login/authentication ka process kaam kare.
app.use(passport.session());  // Session me saved userId se har request par user ko nikaal kar req.user bana deta hai (agar login ho).

passport.use(new LocalStrategy(User.authenticate())); // Login ke time username + password check karta hai
passport.serializeUser(User.serializeUser()); // Login success ke baad session me kya store karna hai decide karta hai
passport.deserializeUser(User.deserializeUser()); // Har next request pe session se user nikaal kar req.user banata hai

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user; //res.locals.currUser makes currUser available everywhere in templates — but ONLY for that single request.
  next();
});

app.use("/listings/:id/reviews", reviewRouter);
app.use("/listings", listingsRouter);
app.use("/users", userRouter);

app.all("*", (req, res) => {
  res.status(404).render("errors/errorPageNotFound.ejs");
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Some Thing Went Wrong!" } = err;
  res.status(status).render("errors/error.ejs", { message });
});

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
