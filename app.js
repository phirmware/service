var express = require("express");
var app = express();
var methodOverride = require('method-override');
var mongoose = require("mongoose");
var passport = require("passport");
var localStrategy = require("passport-local");
var bodyParser = require("body-parser");
var Services = require("./models/service");
var User = require("./models/user");
var Categories = require("./models/categories");
var loggedinUser = require("./models/loggedinuser");

app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));

//passport configuration
app.use(require("express-session")({
  secret:'I am phirmware   who are you',
  resave:false,
  saveUninitialized:false,
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(loggedinUser.authenticate()));

passport.deserializeUser(loggedinUser.deserializeUser());
passport.serializeUser(loggedinUser.serializeUser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
mongoose.connect("mongodb://localhost/start");

app.get("/", function(req, res) {
  Categories.find({})
    .populate("user")
    .exec(function(err, category) {
      if (err) {
        console.log(err);
      } else {
        User.find({})
          .populate("services")
          .exec(function(err, user) {
            if (err) {
              console.log(err);
            } else {
              res.render("index", { category: category, user: user , currentuser:req.user });
            }
          });
      }
    });
});


app.post("/",isLoggedIn,function(req, res) {
  var name = req.body.user;
  var services = req.body.services;
  var category = req.body.category;
  var data = {
    user: name
  };
  var service = {
    services: services
  };
  var usercategory = {
    category: category
  };
  Categories.create(usercategory, function(err, category) {
    if (err) {
      console.log(err);
    } else {
      category.save(function(err, category) {
        if (err) {
          console.log(err);
        } else {
          User.create(data, function(err, user) {
            if (err) {
              console.log(err);
            } else {
              user.save(function(err, user) {
                if (err) {
                  console.log(err);
                } else {
                  category.user.push(user);
                  category.save(function(err, category) {
                    if (err) {
                      console.log(err);
                    } else {
                      Services.create(service, function(err, service) {
                        if (err) {
                          console.log(err);
                        } else {
                          service.save(function(err, service) {
                            if (err) {
                              console.log(err);
                            } else {
                              user.services.push(service);
                              user.save(function(err, user) {
                                if (err) {
                                  console.log(err);
                                } else {
                                  res.redirect("/");
                                }
                              });
                            }
                          });
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });
});



app.get("/category/:id/pos/:bum", function(req, res) {
  var category = req.params.id;
  var pos = req.params.bum;
  Categories.find({ category })
    .populate("user")
    .exec(function(err, cat) {
      if (err) {
        console.log(err);
      } else {
        res.render("category", { category: category, foundCategory: cat, pos:pos , currentuser:req.user});
      }
    });
});


app.delete('/category/:id/delete',function(req,res){
  var name = req.params.id;
  User.findByIdAndRemove(name,function(err,body){
    if(err){
      console.log(err);
    } else{
      res.redirect('/');
    }
  });
});


app.post('/category/:id/newuser/:num',function(req,res){
  var pos = req.params.num;
  var cate = req.params.id;
  Categories.find({},function(err,caty){
    if(err){
      console.log(err);
    } else{
      var newuser = req.body.newuser;
      User.create({user:newuser},function(err,user){
        if(err){
          console.log(err);
        } else{
          user.save(function(err,user){
            if(err){
              console.log(err);
            } else{
              caty[pos].user.push(user);
              caty[pos].save(function(err,cat){
                if(err){
                  console.log(err);
                } else{
                  res.redirect('/category/' + cate + '/pos/' + pos);
                }
              })
            }
          })
        }
      });
    }
  });
});


// get user route
app.get("/user/:id", function(req, res) {
  User.findById(req.params.id)
    .populate("services")
    .exec(function(err, foundUser) {
      if (err) {
        console.log(err);
      } else {
        res.render("user", { user: foundUser , currentuser:req.user });
      }
    });
});


// add new service
app.post("/user/:id/services", function(req, res) {
  var userService = req.body.service;
  var service = { services: userService };
  User.findById(req.params.id, function(err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      Services.create(service, function(err, service) {
        if (err) {
          console.log(err);
        } else {
          foundUser.services.push(service);
          foundUser.save(function(err, user) {
            if (err) {
              console.log(err);
            } else {
              res.redirect("/user/" + req.params.id);
            }
          });
        }
      });
    }
  });
});


app.get('/checkAPI/categories',function(req,res){
  Categories.find({},function(err,cat){
    if(err){
      res.send(err);
    } else{
      res.send(cat);
    }
  });
});


//===========
//Auth Routes
//===========

//show signup form
app.get('/signup',function(req,res){
  res.render('signup');
});

//register new user
app.post('/signup',function(req,res){
  var newuser = new loggedinUser({username:req.body.username});
  loggedinUser.register(newuser,req.body.password,function(err,user){
    if(err){
      console.log(err);
      return res.render('signup');
    } 
    passport.authenticate('local')(req,res,function(){
      res.redirect('/');
    });
  });
});

//show login form
app.get('/login',function(req,res){
  res.render('login');
});

//login user
app.post('/login',passport.authenticate('local',{
  successRedirect:'/',
  failureRedirect:'/login'
}), function(req,res){ 
});

//logout user
app.get('/logout',function(req,res){
  req.logout();
  res.redirect('/');
});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}

app.listen(3400, function() {
  console.log("Serving at port 3400");
});
