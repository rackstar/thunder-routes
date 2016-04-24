angular.module('roadtrippin.home', [])
  .controller('homeController', function($scope, $window, $state, authFactory, mapFactory, tripFactory) {
    $scope.savedTrips = [];
    $scope.input = {
      tripname: '',
      start: '',
      end: '',
      inviteFields: ['']
    };
    $scope.isTripsClosed = false;
    $scope.isCreateClosed = false;
    $scope.username = authFactory.getCurrentUser();

    mapFactory.locationAutoComplete('start', function(address) {
      $scope.input.start = address;
    });
    mapFactory.locationAutoComplete('end', function(address) {
      $scope.input.end = address;
    });

    $scope.addTrip = function() {
      var tripObject = {
        username: $scope.username,
        tripname: $scope.input.tripname,
        start: $scope.input.start,
        end: $scope.input.end,
        users: $scope.input.inviteFields,
      };
      tripFactory.addTrip(tripObject)
        .then(function(trip) {
          $state.go('trip', {id: trip._id});
        });
    };

    $scope.addInviteField = function() {
      $scope.input.inviteFields.push('');
    };

    $scope.removeInviteField = function() {
      $scope.input.inviteFields.pop();
    };

    $scope.signout = function () {
      mapFactory.signout();
    };

    $scope.getAllTrips = function() {
      tripFactory.getAllTrips($scope.username)
        .then(function(data) {
          $scope.savedTrips = data;
          console.log($scope.savedTrips);
        })
        .catch(function(error) {
          console.log(error);
        });
    };
    $scope.getAllTrips();
  });
