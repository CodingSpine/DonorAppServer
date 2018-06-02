const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const UserCredentials = require('./models/userCredentials');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');

const config = require('./config');

exports.local = passport.use(new LocalStrategy(UserCredentials.authenticate()));
passport.serializeUser(UserCredentials.serializeUser());
passport.deserializeUser(UserCredentials.deserializeUser());

exports.getToken  = function(user){
    return jwt.sign(user, config.secretKey, {
        expiresIn: 86400
    });
};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts,
    function(jwt_payload, done){
        UserCredentials.findOne({_id: jwt_payload._id}, (err, userCredential) => {
            if (err){
                return done(err, false);
            }
            else if (userCredential){
                return done(null, userCredential);
            }
            else {
                return done(null, false);
            }
        });
    }
));


exports.verifyUser = passport.authenticate('jwt', {session: false});
