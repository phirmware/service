var express = require("express");
var app = express();
var methodOverride = require("method-override");
var mongoose = require("mongoose");
var passport = require("passport");
var localStrategy = require("passport-local");
var bodyParser = require("body-parser");
var multer = require('multer');
var path = require('path');
var Services = require("./models/service");
var User = require("./models/user");
var Categories = require("./models/categories");
var loggedinUser = require("./models/loggedinuser");
var category = require("./routes/category");
var user = require("./routes/user");
var index = require("./routes/index");

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));





//passport configuration
app.use(
  require("express-session")({
    secret: "I am phirmware who are you",
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(loggedinUser.authenticate()));

passport.deserializeUser(loggedinUser.deserializeUser());
passport.serializeUser(loggedinUser.serializeUser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
mongoose.connect("mongodb://localhost/start");

app.use("/category/:id", category);
app.use("/user/:id", user);
app.use("/", index);

app.listen(3400, function() {
  console.log("Serving at port 3400");
});
