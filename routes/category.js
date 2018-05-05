var express = require("express");
var router = express.Router({ mergeParams: true });
var Categories = require("../models/categories");
var User = require("../models/user");

router.get("/pos/:bum", function(req, res) {
  var category = req.params.id;
  var pos = req.params.bum;
  Categories.find({ category })
    .populate("user")
    .exec(function(err, cat) {
      if (err) {
        console.log(err);
      } else {
        res.render("category", {
          category: category,
          foundCategory: cat,
          pos: pos,
          currentuser: req.user
        });
      }
    });
});

router.delete("/delete", function(req, res) {
  var name = req.params.id;
  User.findByIdAndRemove(name, function(err, body) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});

router.post("/newuser/:num", isLoggedIn ,function(req, res) {
  var pos = req.params.num;
  var cate = req.params.id;
  Categories.find({}, function(err, caty) {
    if (err) {
      console.log(err);
    } else {
      var newuser = req.user.username;
      User.create({ user: newuser }, function(err, user) {
        if (err) {
          console.log(err);
        } else {
          user.save(function(err, user) {
            if (err) {
              console.log(err);
            } else {
              caty[pos].user.push(user);
              caty[pos].save(function(err, cat) {
                if (err) {
                  console.log(err);
                } else {
                  res.redirect("/category/" + cate + "/pos/" + pos);
                }
              });
            }
          });
        }
      });
    }
  });
});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  } res.redirect('/login');
}

module.exports = router;
