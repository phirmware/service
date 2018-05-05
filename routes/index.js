var express = require('express');
var router = express.Router();
var Categories = require('../models/categories');
var User = require('../models/user');
var Services = require('../models/service');
var passport = require('passport');
var loggedinUser = require('../models/loggedinuser');


router.get("/", function(req, res) {
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
                res.render("index", {
                  category: category,
                  user: user,
                  currentuser: req.user
                });
              }
            });
        }
      });
  });
  
  router.post("/", isLoggedIn, function(req, res) {
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
  
  
  
  
  
  router.get("/checkAPI/categories", function(req, res) {
    Categories.find({}, function(err, cat) {
      if (err) {
        res.send(err);
      } else {
        res.send(cat);
      }
    });
  });
  
  //===========
  //Auth Routes
  //===========
  
  //show signup form
  router.get("/signup", function(req, res) {
    res.render("signup");
  });
  
  //register new user
  router.post("/signup", function(req, res) {
    var newuser = new loggedinUser({ username: req.body.username ,location:''});
    loggedinUser.register(newuser, req.body.password, function(err, user) {
      if (err) {
        console.log(err);
        return res.render("signup");
      }
      passport.authenticate("local")(req, res, function() {
        res.redirect("/");
      });
    });
  });
  
  //show login form
  router.get("/login", function(req, res) {
    res.render("login");
  });
  
  //login user
  router.post(
    "/login",
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/login"
    }),
    function(req, res) {}
  );
  
  //logout user
  router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });
  
  

  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/login");
  }

  module.exports = router;