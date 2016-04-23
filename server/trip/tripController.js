var Trip = require('./tripModel.js')
var User = require('../users/userModel.js');
var Q = require('q');

var findTrip = Q.nbind(Trip.findOne, Trip);
var findTrips = Q.nbind(Trip.find, Trip);
var createTrip = Q.nbind(Trip.create, Trip);

var findUser = Q.nbind(User.findOne, User);
var createUser = Q.nbind(User.create, User);

module.exports = {
  getAllTrips: function (req, res, next) {
    var username = req.params.username;
    findUser({username: username})
      .then(function(user) {
        findTrips({_id: {$in: user.trips}})
          .then(function(trips) {
            res.status(200).json(trips);
          })
      })
      .fail(function(error) {
        next(error);
      });
  },

  addTrip: function(req, res, next) {
    var username = req.body.username;
    var tripName = req.body.tripname;
    findUser({username: username})
      .then(function(user) {
        createTrip({
          name: tripName,
          users: user._id
        })
          .then(function(trip) {
            user.trips.push(trip._id);
            user.save();
          });
    })
    .catch(function (error) {
        next(error);
    });
  },

  addUser: function(req, res, next) {
    var username = req.body.username;
    var tripId = req.body.trip_id;
    findUser({username: username})
      .then(function(user) {
        findTrip({_id: tripId})
          .then(function(trip) {
            user.trips.push(tripId);
            trip.users.push(user._id);
            user.save();
            trip.save();
          });
      })
      .catch(function (error) {
        next(error);
      });
  }
};
