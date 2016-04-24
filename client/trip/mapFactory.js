angular.module('roadtrippin.mapFactory', [])

  .factory('mapFactory', function($http, $q, $window, $location) {

    var locationAutoComplete = function(inputField, callback) {
      var startAutoComplete = new google.maps.places.Autocomplete(
        document.getElementById(inputField), {
        types: ['geocode']
      });

      startAutoComplete.addListener('place_changed', function() {
        var address = startAutoComplete.getPlace().formatted_address;
        callback(address);
      });
    };

    //send endpoints and array of waypoints to the server
    var saveJourneyWithWaypoints = function (tripObject) {
      return $http({
        method: 'POST',
        url: '/addJourney',
        data: JSON.stringify(tripObject)
      }).then(function (res) {
        return res;
      }).catch(function (err) {
        console.log(err);
      });
    };

    var getTrip = function(trip_id) {
      return $http({
        method: 'GET',
        url: '/getTrip/' + trip_id
      }).then(function (res) {
        return res.data;
      }).catch(function (err) {
        console.log(err);
      });
    };

    var signout = function() {
      $window.localStorage.removeItem('com.roadtrippin');
      $window.localStorage.removeItem('profile');
      $location.path('/signin');
    };

    return {
      locationAutoComplete: locationAutoComplete,
      saveJourneyWithWaypoints: saveJourneyWithWaypoints,
      getTrip: getTrip,
      signout: signout
    };
  });
