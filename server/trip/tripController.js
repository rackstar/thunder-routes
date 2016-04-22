var Trip = require('./tripModel.js')
var Q = require('q');

var findTrip = Q.nbind(Trip.findOne, Trip);
var createTrip = Q.nbind(Trip.create, Trip);

module.exports = {
  
};
