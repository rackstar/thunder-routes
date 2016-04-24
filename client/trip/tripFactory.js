angular.module('roadtrippin.tripFactory', [])

  .factory('tripFactory', function($http, $q, $window, $location) {
    var addTrip = function (tripObject) {
      var deferred = $q.defer ();
      $http({
        method: 'POST',
        url: '/addTrip',
        data: JSON.stringify(tripObject)
      }).then(function (res) {
        deferred.resolve (res);
      }).catch(function (err) {
        deferred.reject (err);
      });
      return deferred.promise;
    };

    var getAllTrips = function(user_id) {
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: '/getAllTrips/' + user_id
      }).then(function (res) {
        deferred.resolve (res.data);
      }).catch(function (err) {
        deferred.reject (err);
      });
      return deferred.promise;
    };

    return {
      addTrip: addTrip,
      getAllTrips: getAllTrips
    };
  });