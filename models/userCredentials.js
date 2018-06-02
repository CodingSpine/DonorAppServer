const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userCredentialsSchema = new Schema({});
userCredentialsSchema.plugin(passportLocalMongoose);

var UserCredentials = mongoose.model('UserCredential', userCredentialsSchema);

module.exports = UserCredentials;
