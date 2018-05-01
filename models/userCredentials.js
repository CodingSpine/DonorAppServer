const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userCredentialsSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

var UserCredentials = mongoose.model('UserCredential', userSchema);

module.exports = UserCredentials;
