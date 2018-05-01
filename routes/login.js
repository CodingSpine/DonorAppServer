const express = require('express');

const loginRouter = express.Router();
const UserCredentials = require('../model/UserCredentials');

// loginRouter.route('/')
// .all()
// .get()
// .post()
// .put()
// .delete();'
loginRouter.post('/', (req, res, next) => {
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

loginRouter.get('/logout', (req, res) =>{
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

module.exports = loginRouter;
