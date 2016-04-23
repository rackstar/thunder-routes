var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ChatSchema = Schema({
  message: String,
  username: String,
  trip_id: { type: Schema.Types.ObjectId }
},
{
  timestamps: true
});

module.exports = mongoose.model('chat', ChatSchema)