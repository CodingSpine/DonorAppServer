const express = require('express');

const loginRouter = express.Router();

const MongoClient = require('mongodb').MongoClient;

var uri = "mongodb://app:nEshKXCPxp9vqj7o@\
donorapp-dev-shard-00-00-e7utu.mongodb.net:27017,\
donorapp-dev-shard-00-01-e7utu.mongodb.net:27017,\
donorapp-dev-shard-00-02-e7utu.mongodb.net:27017/test?ssl=true&replicaSet=DonorApp-Dev-shard-0&authSource=admin";
MongoClient.connect(uri, function(err, client) {
   const collection = client.db("DonorApp-Demo").collection("Login");
   // perform actions on the collection object
   collection.insertOne(
       {"name":"Ray"},
        (error, result) => {
            console.log(error);
            console.log(result);
        });
   client.close();
});

loginRouter.route('/')
.all()
.get()
.post()
.put()
.delete();

module.exports = loginRouter;
