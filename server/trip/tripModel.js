var mongoose = require('mongoose');
var crypto = require('crypto');
var Q = require('q');
var Journeys = require('../journey/journeyModel.js');
var Users = require('../users/userModel.js');
var Schema = mongoose.Schema;

var TripSchema = new Schema({
  users: [Users],
  journeys: [Journeys],
  chat_id: { type: Schema.Types.ObjectId }
},
{
  timestamps: true
});

module.exports = TripSchema;