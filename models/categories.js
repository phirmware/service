var mongoose = require('mongoose');

var categoriesSchema = new mongoose.Schema({
   category:String,
   user:[{
       type:mongoose.Schema.Types.ObjectId,
       ref:'users'
   }]
});
var Categories = mongoose.model('categories',categoriesSchema);
module.exports = Categories; 