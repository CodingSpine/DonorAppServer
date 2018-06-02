const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    phone: {
        type: String,
        required: true,
        unique: true
    },
    countryCode:{
        type: String,
        required: true,
        default: '+91'
    },
    firstName: {
        type: String,
        required: true
    },
    lastName :String,
    email: {
        type: String,
        required: true,
        unique: true
    }
});

var Users = mongoose.model('User', userSchema);

module.exports = Users;
