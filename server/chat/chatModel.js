var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ChatSchema = Schema({
  username: String,
  message: String,
  trip_id: { type: Schema.Types.ObjectId },
  created: { type: Date, default: new Date() }
});

module.exports = mongoose.model('Chat', ChatSchema)