const express = require('express');
const cors = require('cors');
const app = express();

const whitelist = [];
var corsOptionsDelegate = (req, callback) => {
    var corsOptions;
    if (whitelist.indexOf(req.header('Origin')) !== -1){
        corsOptions = {origin: true};
    }
    else {
        corsOptions = {origin: false};
    }
    callback(null, corsOptions);
};

//use this to allow all Origins
exports.cors = cors();
//use this to allow only Origins from the whitelist:
//exports.corsWithOptions = cors(corsOptionsDelegate);
