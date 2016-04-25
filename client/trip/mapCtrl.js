angular.module('roadtrippin.maps', [])
  .controller('mapController', function($scope, $stateParams, mapFactory, authFactory, 
    tripFactory, gservice, $location, $anchorScroll, socket, chatFactory) {
    $scope.username = authFactory.getCurrentUser();
    $scope.route = {};
    $scope.route.stopOptions = [0, 1, 2, 3, 4, 5];
    $scope.route.numStops = 0;
    $scope.places = [];
    $scope.savedRoutes = [];
    $scope.input = {};
    $scope.messages = [];

    mapFactory.locationAutoComplete('start', function(address) {
      $scope.input.start = address;
    });
    mapFactory.locationAutoComplete('end', function(address) {
      $scope.input.end = address;
    });

    $scope.getTrip = function() {
      tripFactory.getTrip($stateParams.tripId)
        .then(function(trip) {
          console.log(trip);
          $scope.input.tripname = trip.name;
          $scope.input.start = trip.journeys[0].startPoint;
          $scope.input.end = trip.journeys[0].endPoint;
          gservice.refresh();
          gservice.render(trip.journeys[0].startPoint, trip.journeys[0].endPoint, trip.journeys[0].wayPoints);
        });
    };

    //this is a call to our Google maps API factory for directions
    $scope.getRoute = function() {
      // If start/end not set by autocomplete, set from value of field.
      $scope.route.start = $scope.route.start || document.getElementById('start').value;
      $scope.route.end = $scope.route.end || document.getElementById('end').value;
      gservice.calcRoute($scope.route.start, $scope.route.end, $scope.route.numStops)
        .then(function(places) { splitLocations(places); });
      $scope.route.start = null;
      $scope.route.end = null;
    };

    $scope.yelp = function(dataQuery, obj) {
      var yelpData = tripFactory.yelp(dataQuery);
      return yelpData;
    };

    var splitLocations = function (places) {
      $scope.places = [];
      //copy the places array before we start splitting things so our original stays in-tact
      var placesCopy = [];
      for (var i = 0; i < places.length; i++) {
        //this apparently is needed for a clean copy...
        placesCopy.push(JSON.parse(JSON.stringify(places[i])));
      }
      placesCopy.forEach(function (place) { //split address for easier formatting
        $scope.yelp(place)
          .then(function(yelpData) {
            place.phone = yelpData.phone;
            place.rating = yelpData.rating;
            place.url = yelpData.url;
            place.image = yelpData.image;
            console.log(yelpData.image, 'image link');
            place.location = place.location.split(', ');
            $scope.places.push(place);
          });
      });
    };

    $scope.getLetter = function (i) {
      return String.fromCharCode(i + 66);
    };

    $scope.saveRoute = function () {
      mapFactory.saveJourneyWithWaypoints(gservice.thisTrip).then($scope.getAll());
    };

    $scope.getAll = function () {
      // mapFactory.getAllRoutes().then(function (results) {
      //   $scope.savedRoutes = results;
      // });
    };

    $scope.viewSavedRoute = function (hash) {
      $location.hash('top');
      $anchorScroll();
      for (var i = 0; i < $scope.savedRoutes.length; i++) {
        if ($scope.savedRoutes[i].hash === hash) {
          //split up waypoints array into names ans locations. Even index ==== name, odd index === location
          $scope.savedRoutes[i].stopLocations = [];
          $scope.savedRoutes[i].stopNames = [];
          for (var j = 0; j < $scope.savedRoutes[i].wayPoints.length; j++) {
            if (j % 2 === 0) {
              $scope.savedRoutes[i].stopNames.push($scope.savedRoutes[i].wayPoints[j]);
            } else {
              $scope.savedRoutes[i].stopLocations.push($scope.savedRoutes[i].wayPoints[j]);
            }
          }
          //set $scope.places to saved stop data so stop data will display on page
          var places = [];
          for (var k = 0; k < $scope.savedRoutes[i].stopNames.length; k++) {
            var location = $scope.savedRoutes[i].stopLocations[k];
            var place = {
              name: $scope.savedRoutes[i].stopNames[k],
              location: location,
              position: k
            };
            places.push(place);
          }
          //add stop locations to stops array, render stops to map
          gservice.render($scope.savedRoutes[i].startPoint, $scope.savedRoutes[i].endPoint, places)
          .then(function (places) { splitLocations(places); });
        }
      }
    };

    $scope.sendMsg  = function($event) {
      $scope.data = {
        trip_id: $stateParams.tripId,
        username: $scope.username,
        message: $scope.data.message
      };
      console.log($scope.data, 'data being sent');
      socket.emit('new message', $scope.data);
      $scope.data.message = '';
      $event.preventDefault();
    };

    socket.on('message saved', function(msg) {
      // msg.time = moment().fromNow()
      $scope.messages.push(msg);
      $scope.$digest();
    });

    $scope.getChat = function(tripId) {
      chatFactory.getChat($stateParams.tripId)
        .then(function(messages) {
          $scope.messages = messages;
          console.log($scope.messages)
        });
    };

    $scope.getTrip();

    $scope.signout = function () {
      mapFactory.signout();
    };
  });
