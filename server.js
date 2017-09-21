'use strict';

var express = require('express'),
  app = express(),
  server = require('http').createServer(app),
  port = process.env.PORT || 3000,
  bodyParser = require('body-parser');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.json());

var routes = require('./routes/ggr2-delivery-routes');
routes(app);

//app.listen(port);
server.listen(port);

console.log('RESTful API server started on: ' + port);