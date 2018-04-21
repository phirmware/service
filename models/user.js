var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    user : String,
    services : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'services'
    }]
});

var User = mongoose.model('users',userSchema);

module.exports = User;