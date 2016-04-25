var Trip = require('./tripModel.js');
var User = require('../users/userModel.js');
var mailer = require('nodemailer');
var Yelp = require('yelp');
var Q = require('q');

var findTrip = Q.nbind(Trip.findOne, Trip);
var findTrips = Q.nbind(Trip.find, Trip);
var createTrip = Q.nbind(Trip.create, Trip);

var findUser = Q.nbind(User.findOne, User);
var findUsers = Q.nbind(User.find, User);
var createUser = Q.nbind(User.create, User);

var yelp = new Yelp({
  consumer_key: '5SlmhNd4EGrhInttbfX7uw',
  consumer_secret: 'nVRghOPAKVMOXri27Qgzu5N9e5E',
  token: 'wKAFie0VOM520oqk9xA6DNHrKDS4B-8p',
  token_secret: '5O16qo8TG3z7jjfkTMOJYDLWDwY',
});

var transporter = mailer.createTransport({
  service: 'Gmail',
  auth: {
      user: 'hrr14hera@gmail.com',
      pass: 'temppass123'
  }
});

var mailOptions = {
    from: 'hrr14hera@gmail.com', // sender address
    subject: 'You have been invited to go roadtrippin!', // Subject line
};

module.exports = {
  getAllTrips: function (req, res, next) {
    var username = req.params.username;
    findUser({username: username})
      .then(function(user) {
        findTrips({_id: {$in: user.trips}})
          .then(function(trips) {
            res.status(200).json(trips);
          });
      })
      .fail(function(error) {
        next(error);
      });
  },

  addTrip: function(req, res, next) {
    var username = req.body.username;
    var tripname = req.body.tripname;
    var users = req.body.users.filter(function(name) { return name.length; });
    var journey = {
      startPoint: req.body.start,
      endPoint: req.body.end
    };
    findUser({username: username})
      .then(function(user) {
        var newTrip = {
          name: tripname,
          creator: user._id,
          journeys: [journey]
        };
        Trip.create(newTrip)
          .then(function(trip) {
            trip.users.push(user._id);
            trip.save();
            user.trips.push(trip._id);
            user.save();
            findUsers({username: {$in: users}})
              .then(function(friends) {
                friends.forEach(function(friend) {
                  if (trip.users.indexOf(friend._id) < 0) {
                    trip.users.push(friend._id);
                    friend.trips.push(trip._id);
                    friend.save();
                  }
                });
                trip.save();
                res.status(201).json(trip);
              });
          });
      })
      .catch(function (error) {
        next(error);
      });
  },

  updateTrip: function(req, res, next) {
    var tripId = req.body.tripId;
    var newTripname = req.body.tripname;
    var newJourney = req.body.journey;
    var newUsernames = req.body.users;

    findTrip({_id: tripId})
      .then(function(trip) {
        findUsers({username: {$in: newUsernames}})
          .then(function(newUsers) {
            // Stringify ids for comparison to work properly
            var newUserIds = newUsers.map(function(user) { return user._id; });
            var newUserIdStrings = newUsers.map(function(user) { return JSON.stringify(user._id); });
            var removedIds = trip.users.filter(function(userId) {
              return newUserIdStrings.indexOf(JSON.stringify(userId)) < 0;
            });

            // Update trips list on removed users
            findUsers({_id: {$in: removedIds}})
              .then(function(removedUsers) {
                removedUsers.forEach(function(user) {
                  var tripIndex = user.trips.indexOf(trip._id);
                  console.log(tripIndex);
                  if (tripIndex > -1) {
                    user.trips.splice(tripIndeax, 1);
                    user.save();
                  }
                });
              });

            trip.name = newTripname;
            trip.journeys = [newJourney];
            trip.users = newUserIds;
            trip.save();

            // Update trips list for added users
            newUsers.forEach(function(user) {
              if (user.trips.indexOf(trip._id) < 0) {
                user.trips.push(trip._id);
                user.save();
              }
            });
            res.status(201).json(trip);
          });
      })
      .catch(function (error) {
        next(error);
      });
  },

  getTrip: function(req, res, next) {
    var tripId = req.params.tripId;
    findTrip({_id: tripId})
      .then(function(trip) {
        findUsers({_id: {$in: trip.users}})
          .then(function(users) {
            var usernames = users.map(function(user) { return user.username; });
            var tripObject = {
              body: trip,
              usernames: usernames
            };
            res.status(200).json(tripObject);
          });
      })
      .catch(function (error) {
        next(error);
      });
  },

  yelp: function(req, res) {
    var query = {
      term: req.body.name,
      location: req.body.location,
      limit: 1
    }

    yelp.search(query)
      .then(function (data) {
        if (data) {
          var business = data.businesses[0];
          var yelpData = {
            rating: business.rating_img_url,
            url: business.url,
            phone: business.display_phone,
            image: business.image_url
          };
          res.status(200).json(yelpData);
        }
      })
      .catch(function (err) {
        console.error(err);
      });
  },

  email: function(req, res) {
    mailOptions.to = req.body.email;
    mailOptions.html = '<h3><b>Collaborate and plan your trip with Thunder-Routes</b></h3>' +
                       '<h4>You can join your friends here:</h4>' +
                       req.body.link +
                       '<p>Happy RoadTrippin!</p>'
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
            res.json({yo: 'error'});
        }else{
            console.log('Message sent: ' + info.response);
            res.json({yo: info.response});
        };
    });
  }
};
