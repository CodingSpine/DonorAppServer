const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    phone: {
        type: String,
        required: true,
        unique: true
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
