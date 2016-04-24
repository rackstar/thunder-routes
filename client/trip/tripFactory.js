angular.module('roadtrippin.tripFactory', [])

  .factory('tripFactory', function($http, $q, $window, $location) {
    var addTrip = function(tripObject) {
      return $http({
        method: 'POST',
        url: '/addTrip',
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
      }).then(function (res) {
        return res.data;
      }).catch(function(error) {
        console.log(error);
      });
    };

    return {
      addTrip: addTrip,
      getAllTrips: getAllTrips
    };
  });