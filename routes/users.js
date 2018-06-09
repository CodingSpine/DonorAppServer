var express = require('express');
const usersRouter = express.Router();
const mongoose = require('mongoose');
const cors = require('./cors');
const Users = require('../models/users');
const authenticate = require('../authenticate');

/* GET users listing. */
usersRouter.route('/')
.options(cors.corsWithOptions, (req, res) => {})
.get(cors.corsWithOptions, authenticate.verifyUser, function(req, res, next) {
    Users.find({})
        .then((users) =>{
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(users);
        }, (error) => {
            next(error)
        })
        .catch((error) => {
            next(error);
        });
})
.post(cors.corsWithOptions, authenticate.verifyUser, function(req, res, next){
    Users.create(req.body)
        .then((user) => {
            console.log(user);
            res.statusCode = 201;
            res.setHeader('Content-Type', 'application/json');
            res.json(user);
        }, (error) => {
            next(error)
        })
        .catch((error) => {
            next(error);
        });
})
.put(function(req, res, next){
    res.statusCode = 403;
    res.end('PUT operation not allowed on /users');
})
.delete(function(req, res, next){
    res.statusCode = 403;
    res.end('DELETE operation not allowed on /users');
});

usersRouter.route(':/userId')
.options(cors.corsWithOptions, (req, res) => {})
.all(function(req, res, next){
    res.statusCode = 200;
    rest.setHeader('Content-Type', 'application/json');
    next();
})
.get(cors.corsWithOptions, authenticate.verifyUser, function(req, res, next){
    Users.findById(req.params.userId)
        .then((user) => {
            console.log(user);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(user);
        }, (error) => {
            next(error)
        })
        .catch((error) => {
            next(error);
        });
})
.post(function(req, res, next){
    res.statusCode = 403;
    res.end('POST operation not allowed on /users/'+req.params.userId);
})
.put(cors.corsWithOptions, authenticate.verifyUser, function(req, res, next){
    Users.findByIdAndUpdate(req.params.userId, {
        $set: req.body
    }, {new : true})
        .then((user) => {
            console.log(user);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(user);
        }, (error) => {
            next(error)
        })
        .catch((error) => {
            next(error);
        });

})
.delete(cors.corsWithOptions, authenticate.verifyUser, function(req, res, next){
    Users.findByIdAndRemove(req.params.userId)
        .then((user) => {
            console.log(user);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(user);
        }, (error) => {
            next(error)
        })
        .catch((error) => {
            next(error);
        });
});

module.exports = usersRouter;
