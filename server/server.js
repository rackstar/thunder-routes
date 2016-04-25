var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var morgan = require('morgan');
var mongoose = require('mongoose');
var parser = require('body-parser');
var userController = require('./users/userController.js');
var journeyController = require('./journey/journeyController.js');
var tripController = require('./trip/tripController.js');
var chatController = require('./chat/chatController.js');


// MIDDEWARE
app.use(express.static(__dirname + '/../client'));
app.use(parser.json());
app.use(morgan('dev'));

// MONGO
var mongoUri = process.env.MONGODB_URI || 'mongodb://localhost/roadtrippin';
mongoose.connect(mongoUri);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Mongoose is connected');
});

// ROUTES
app.post('/addJourney', journeyController.addJourney);
app.post('/addTrip', tripController.addTrip);
app.get('/trip/:tripId', tripController.getTrip);
app.get('/getAllTrips/:username', tripController.getAllTrips);

// app.post('/saveJourney', journeyController.saveJourney);
// app.get('/saveJourney', journeyController.getAll);

app.post('/signin', userController.signin);
app.post('/signup', userController.signup);
app.use(userController.errorHandler);

app.post('/chat', chatController.getChat);
app.post('/yelp', tripController.yelp)
// SOCKET.IO
io.on('connection', function(socket){
  console.log('a user connected');
 
  socket.on('new message', function(msg){
    chatController.newMsg(msg);

    io.emit('message saved', msg);
  });

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
