const express = require('express');

const loginRouter = express.Router();
const cors = require('./cors');
const UserCredentials = require('../model/UserCredentials');
const Users = require('../model/users');
const passport = require('passport');
const authenticate = require('../authenticate');

// loginRouter.route('/')
// .all()
// .get()
// .post()
// .put()
// .delete();'
loginRouter.post('/', cors.cors, authenticate.verifyUser, (req, res, next) => {
    if (!req.session.user){
        var authHeader = req.headers.authorization;
        if(!authHeader){
            var err = new Error('Unauthenticated Request!');
            res.setHeader('WWW-Authenticate', 'Basic');
            err.status = 401;
            return next(err);
        }

        var authAttempt = new Buffer(authHeader.split(' ')[1], 'base64');
        var username = authAttempt[0];
        var password = authAttempt[1];

        UserCredentials.findOne({username: username})
        .then((user) => {
            if(user.password === password){
                req.session.user = 'authenticated';
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.end('Authenticated');
                //res.cookie('user', 'admin', {signed: true});
                // next();
            }
            else if (user.password !== password){
                var err = new Error('Incorrect credentials!');
                //log incorrect password
                err.status = 403;
                return next(err);
            }
            else if (user === null){
                var err = new Error('Incorrect credentials!');
                //log nonexistent user
                err.status = 403;
                return next(err);
            }
            else{
                var err = new Error('Unauthenticated Request!');
                res.setHeader('WWW-Authenticate', 'Basic');
                err.status = 401;
                return next(err);
            }
        })
        .catch((err) => next(err));
        //Check with db if username, password is correct

    }
    else{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Already authenticated');
    }
});

loginRouter.post('/signup', cors.cors, (req, res, next) => {
    UserCredentials.register(new UserCredentials({username: req.body.username}),
        req.body.password,
        (credentialerr, userCredential) => {
            if (credentialerr){
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({err: err});
                return;
            }
            else{
                Users.findOne({phone: req.body.username})
                .then((user) =>{
                    var error;
                    if(user !== null){
                        error = new Error('User Credential created but User already exists. Contact Admin.');
                        error.status = 403;
                        next(error);
                    }
                    else{
                        var userAttributes = {};
                        if (req.body.firstName){
                            userAttributes.firstName = req.body.firstName;
                        }
                        else {
                            error = new Error('First Name is required.');
                            next(error);
                        }
                        if (req.body.email){
                            userAttributes.email = req.body.email;
                        }
                        else {
                            error = new Error('Email is required.');
                            next(error);
                        }
                        if(req.body.countryCode){
                            userAttributes.countryCode = req.body.countryCode;
                        }
                        if (req.body.lastName){
                            userAttributes.lastName = req.body.lastName;
                        }
                        var newUser = Users.create(userAttributes);
                        res.status = 201;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({success: true, status: 'Registered!', user: newUser});
                    }
                })
                .catch((err) =>{
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({err: err});
                    return;
                });
            }
        });
});

loginRouter.post('login',cors.cors, (req, res, next) => {
    passport.authenticate('local', (err, user, info) =>{
        if (err){
            return next(err);
        }
        if (!user){
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: false, status: 'Login Unsuccessful.', err: info});
        }
        req.logIn(user, (err) =>{
            if (err){
                res.statusCode = 401;
                res.setHeader('Content-Type', 'application/json');
                res.json({success: false, status: 'Login Unsuccessful.', err: 'Could not log in user.'});
            }
            var token = authenticate.getToken({_id: req.user._id});
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: true, token: token, status: 'Success'});
        });
    })(req, res, next);
});

loginRouter.get('/logout', cors.cors, (req, res) =>{
    if(req.session){
        req.session.destroy();
        res.clearCookie('session-id');
        //test what this line does:
        res.redirect('/');
    }
    else {
        var err = new Error('Not logged in');
        err.status = 403;
        next(err);
    }
});

//// NOTE: next function may need to be removed, since it wasn't there in the tutorial.
loginRouter.get('/checkJWTToken', cors.cors, (req, res, next) =>{
    passport.authenticate('jwt', {session: false}, (err, user, info) =>{
        if(err){
            return next(err);
        }
        if (!user){
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            return res.json({status: 'JWT Invalid', success: false, err: info});
        }
        else{
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.json({status: 'JWT Valid', success: true, user});
        }
    })(req, res);
});

module.exports = loginRouter;
