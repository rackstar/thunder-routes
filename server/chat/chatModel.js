var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ChatSchema = Schema({
  message: String,
  username: String,
  trip_id: { type: Schema.Types.ObjectId }
  created: { type: Date, default: new Date() },
});

module.exports = mongoose.model('Chat', ChatSchema)