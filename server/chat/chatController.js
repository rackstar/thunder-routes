var Chat = require('./chatModel.js')

module.exports = {
  getChat: function(req, res, next) {
    var trip_id = req.body.trip_id;
    console.log(trip_id, 'id');
    Chat.find({ trip_id: trip_id })
      .exec(function(err, messages) {
        if (err) {
          next(new Error(err));
        }
        res.status(200).json(messages);
      })
  },

  newMsg: function(data) {
    console.log(data, 'data');
    var newMsg = new Chat({
      username: data.username,
      message: data.message,
      trip_id: data.trip_id,
      created: new Date()
    });
    newMsg.save(function(err, msg) {
      // io.in(msg.trip_id).emit()
      console.log(msg, 'new message saved');
    });
  }
};