var Chat = require('./chatModel.js')

module.exports = {
  getChat: function(req, res, next) {
    var trip_id = req.body.trip_id;
    console.log(trip_id, 'id');
    Chat.find({ trip_id: trip_id })
      .then(function(err, messages) {
        if (err) {
          next(new Error(err));
        }
        res.status(200).json(messages);
      })
  },

  newMsg: function(data, io) {
    var newMsg = new Chat({
      username: data.username,
      message: data.message,
      trip_id: data.trip_id,
      created: new Date()
    });
    newMsg.save(function(err, msg) {
      // io.in(msg.trip_id).emit()
      io.sockets.emit('message saved', msg);
      console.log(msg);
    });
  },

  setup: function(req, res, next) {
      //Array of chat data. Each object properties must match the schema object properties
      var chatData = [{
        message: 'Hi',
        username: 'rocky',
        trip_id: "571acec0cb131271a6f8cd07"
      }, {
        message: 'Hello',
        username: 'rm',
        trip_id: "571acec0cb131271a6f8cd07"
      }, {
        message: 'Ait',
        username: 'Rocky',
        trip_id: "571acec0cb131271a6f8cd07"
      }, {
        message: 'Amazing room',
        username: 'rm',
        trip_id: "571acec0cb131271a6f8cd07"
      }];

      //Loop through each of the chat data and insert into the database
      for (var c = 0; c < chatData.length; c++) {
        //Create an instance of the chat model
        var newChat = new Chat(chatData[c]);
        //Call save to insert the chat
        newChat.save(function(err, savedChat) {
          console.log(savedChat);
        });
      }
      //Send a resoponse so the serve would not get stuck
      res.send('created');
  }
};