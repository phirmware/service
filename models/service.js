var mongoose = require('mongoose');

var servicesSchema = new mongoose.Schema({
    services : String,
    image:String
});

var service = mongoose.model('services',servicesSchema);

module.exports = service;
