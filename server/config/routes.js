var userController = require('../users/userController.js');
var chatController = require('../chat/chatController.js');
var tripController = require('../trip/tripController.js');
var journeyController = require('../journey/journeyController.js');

module.exports = function(app, express) {
  app.post('/saveJourney', journeyController.saveJourney);
  app.get('/saveJourney', journeyController.getAll);
  app.post('/signin', userController.signin);
  app.post('/signup', userController.signup);

  app.route('/chat')
    .post(chatController.getChat)

  app.post('/chat/setup', chatController.setup);

  app.use(userController.errorHandler);
}