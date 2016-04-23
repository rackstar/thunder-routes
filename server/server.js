var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');

// MONGO
var mongoUri = process.env.MONGODB_URI || 'mongodb://localhost/roadtrippin';
mongoose.connect(mongoUri);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Mongoose is connected');
});

// Middleware and Routing Configuration
require('./config/middleware.js')(app, express);
require('./config/routes.js')(app, express);

// SOCKET.IO
io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

// CONNECTION
var port = process.env.PORT || 8080;

http.listen(port, function() {
  console.log('Listening to: ' + port);
});

module.exports = app;
