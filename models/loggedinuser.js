var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var loggedinUserSchema = new mongoose.Schema({
    username:String,
    password:String
});

loggedinUserSchema.plugin(passportLocalMongoose);
var appUser = mongoose.model('loggedinuser',loggedinUserSchema);

module.exports = appUser; 