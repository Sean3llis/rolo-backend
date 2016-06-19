const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./router');
const mongoose = require('mongoose');

/**
 * DATABASE
 */
 mongoose.connect('localhost:27017/myDatabase');


/**
 * SERVER
 */
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log('serving on: %s', port);

/**
 * MIDDLEWARE
 */
app.use(morgan('combined'));
app.use(bodyParser.json({type: '*/*'}));
router(app);
