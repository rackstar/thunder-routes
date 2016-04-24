var Q = require('q');
var Journey = require('./journeySchema.js');
var Trip = require('../trip/tripModel.js');

var findJourney = Q.nbind(Journey.findOne, Journey);
var createJourney = Q.nbind(Journey.create, Journey);

var findTrip = Q.nbind(Trip.findOne, Trip);
var createTrip = Q.nbind(Trip.create, Trip);

module.exports = {
  addJourney: function (req, res, next) {
    var start = req.body.start;
    var end = req.body.end;
    var waypoints = [];

    for (var i = 0; i < req.body.waypoints.length; i++) {
      waypoints[req.body.waypoints[i].position] = [req.body.waypoints[i].name, req.body.waypoints[i].location];
    }

    var waypointsCopy = [].concat.apply([], waypoints);
    waypoints = waypointsCopy;

    findTrip({ _id: req.body.trip_id })
      .then(function (trip) {
        var found = false;
        trip.journeys.forEach(function(journey) {
          if(journey.wayPoints === waypoints) {
            found = true;
          }
        });
        if(!found) {
          trip.journeys.push({
            startPoint: start,
            endPoint: end,
            wayPoints: waypoints
          });
          trip.save();
          res.status(201).json(trip.journeys);
        } else {
          next(new Error('Journey already exist!'));
        }
      })
      .catch(function (error) {
        next(error);
      });

    // findJourney({wayPoints: waypoints})
    //   .then(function (waypoint) {
    //     if (!waypoint) {
    //       return createJourney({
    //         startPoint: start,
    //         endPoint: end,
    //         wayPoints: waypoints
    //       });
    //     } else {
    //       next(new Error('Journey already exist!'));
    //     }
    //   })
    //   .catch(function (error) {
    //     next(error);
    //   });
  }

  // getAll: function (req, res, next) {
  //   Journey.find({})
  //     .then(function (data) {
  //       res.status(200).send(data);
  //     })
  //     .catch(function(error) {
  //       next(error);
  //     });
  // }
};
