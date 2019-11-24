var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  bodyParser = require('body-parser'),
  session = require('express-session');
  

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var routes = require('./api/routes/textractorRoutes'); //importing routes

app.use(session({secret: 'TEXTRACTOR',resave: true,saveUninitialized: true}));
app.use('/textractor/v0.1',routes);

app.listen(port);
console.log('todo list RESTful API server started on: ' + port);