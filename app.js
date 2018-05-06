//packages
const express = require("express"); //used for the app engine
const path = require("path"); //used for filepaths
const logger = require("morgan"); //used to log
const cookieParser = require("cookie-parser"); //used to parse cookies
const bodyParser = require("body-parser"); //used to parse url
const session = require("express-session");

//routes
// const calls = require('./routes/calls'); //api calls
const calls = require("./routes/render"); //renderer calls
const app = express();

//set view engine
app.set("views", path.join(__dirname, "views/pages")); //where to store templates
app.set("view engine", "ejs"); //using ejs as the template engine

//load packages & configure app
app.use(logger("dev")); //logs the requests and related technical data
app.use(cookieParser()); //parse cookies
app.use(bodyParser.json()); //parses the body of an HTTP request. Need to check out https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/
app.use(bodyParser.urlencoded({ extended: true })); //allow nested objects
app.use(express.static(path.join(__dirname, "public"))); //set the static for css and related things.

app.use(
  session({
    key: "email",
    secret: "THEspoon1sl0st",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 3628800000 //six weeks in milliseconds.
    }
  })
);

//set directions
app.use("/", calls);

//Confirm cookie is valid.
app.use((req, res, next) => {
  if (req.cookies.email && !req.session.user) {
    res.clearCookie("email");
  }
  next();
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render("error", { message: err.message, title: "Error" });
  console.log(err.message);
});

module.exports = app;
