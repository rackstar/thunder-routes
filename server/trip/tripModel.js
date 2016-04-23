var mongoose = require('mongoose');
var crypto = require('crypto');
var Q = require('q');
var Journey = require('../journey/journeyModel.js');
var User = require('../users/userModel.js');
var Schema = mongoose.Schema;

var TripSchema = new Schema({
  name: String,
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  journeys: [{
    type: Schema.Types.ObjectId,
    ref: 'Journey'
  }],
  chat_id: { type: Schema.Types.ObjectId }
},
{
  timestamps: true
});

module.exports = TripSchema;