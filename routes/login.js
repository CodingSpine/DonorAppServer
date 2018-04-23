const express = require('express');

const loginRouter = express.Router();

loginRouter.route('/')
.all()
.get()
.post()
.put()
.delete();

module.exports = loginRouter;
