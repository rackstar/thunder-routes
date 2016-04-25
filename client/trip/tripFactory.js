angular.module('roadtrippin.tripFactory', [])

  .factory('tripFactory', function($http, $q, $window, $location) {
    var addTrip = function(tripObject) {
      return $http({
        method: 'POST',
        url: '/addTrip',
        data: tripObject
      }).then(function(res) {
        return res.data;
      }).catch(function(err) {
        console.log(err);
      });
    };

    var updateTrip = function(tripObject) {
      return $http({
        method: 'POST',
        url: '/updateTrip',
        data: tripObject
      }).then(function (res) {
        return res.data;
      }).catch(function (err) {
        console.log(err);
      });
    };

    var getAllTrips = function(user_id) {
      return $http({
        method: 'GET',
        url: '/getAllTrips/' + user_id
      }).then(function(res) {
        return res.data;
      }).catch(function(error) {
        console.log(error);
      });
    };

    var getTrip = function(trip_id) {
      return $http({
        method: 'GET',
        url: '/trip/' + trip_id
      }).then(function(res) {
        return res.data;
      }).catch(function(error) {
        console.log(error);
      });
    };

    var yelp = function(data) {
      return $http({
        method: 'POST',
        url: '/yelp',
        data: data
      }).then(function(res) {
        return res.data;
      }).catch(function(err) {
        console.log(err);
      });
    };

    return {
      addTrip: addTrip,
      updateTrip: updateTrip,
      getAllTrips: getAllTrips,
      getTrip: getTrip,
      yelp: yelp
    };
  });
