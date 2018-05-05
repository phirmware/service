var express = require('express');
var router = express.Router({mergeParams:true});
var User = require('../models/user');
var Services = require('../models/service');
var appUser = require('../models/loggedinuser');
var multer = require('multer');
var path = require('path');

// set storage
var storage = multer.diskStorage({
  destination:'./public/uploads/',
  filename: function(req,file,cb){
    cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});


//Initialize upload
var upload = multer({
  storage:storage
}).single('myImage');




// get user route
router.get("/", function(req, res) {
    User.findById(req.params.id)
      .populate("services")
      .exec(function(err, foundUser) {
        if (err) {
          console.log(err);
        } else {
          res.render("user", { user: foundUser, currentuser: req.user });
        }
      });
  });
  


  // add new service
  router.post("/services", function(req, res) {   
    User.findById(req.params.id, function(err, foundUser) {
      if (err) {
        console.log(err);
      } else {
        upload(req,res,(err)=>{
          if(err){
            console.log(err);
          } else{
            let service = { services: req.body.service , image:req.file.filename};
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
        })
      }
    });
  });

  router.get('/profile',function(req,res){
    appUser.findById(req.params.id,function(err,presentUser){
      if(err){
        console.log(err);
      } else{
        res.render('dashboard',{presentUser:presentUser});
      }
    })
  });

  router.get('/profile/edit',function(req,res){
    appUser.findById(req.params.id,function(err,presentUser){
      if(err){
        console.log(err);
      } else{
        res.render('dashboardedit',{presentUser:presentUser});
      }
    })
  });

  router.put('/profile',function(req,res){
    appUser.findByIdAndUpdate(req.params.id,{username:req.body.username,location:req.body.location,phonenumber:req.body.phonenumber},function(err,user){
      if(err){
        console.log(err);
      } else{
        res.redirect('/user/' + req.params.id + '/profile');
      }
    })
  })
  
  module.exports = router;