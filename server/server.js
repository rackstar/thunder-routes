var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var morgan = require('morgan');
var mongoose = require('mongoose');
var parser = require('body-parser');
var userController = require('./users/userController.js');
var journeyController = require('./journey/journeyController.js');



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
app.post('/saveJourney', journeyController.saveJourney);
app.get('/saveJourney', journeyController.getAll);
app.post('/signin', userController.signin);
app.post('/signup', userController.signup);
app.use(userController.errorHandler);

// SOCKET.IO
io.on('connection', function(socket) {
  console.log('a user connected');
})

// CONNECTION
var port = process.env.PORT || 8080;

app.listen(port, function() {
  console.log('Listening to: ' + port);
});

module.exports = app;
