angular.module('roadtrippin.home', [])
  .controller('homeController', function($scope, mapFactory, tripFactory) {
    $scope.trips = [];
    $scope.input = {
      start: '',
      end: '',
      inviteFields: ['']
    };
    $scope.isTripsClosed = false;
    $scope.isCreateClosed = false;

    mapFactory.locationAutoComplete('start', function(address) {
      $scope.input.start = address;
    });
    mapFactory.locationAutoComplete('end', function(address) {
      $scope.input.end = address;
    });

    $scope.createTrip = function() {
      tripFactory.addTrip($scope.username, $scope.input.tripname);
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
      $scope.savedRoutes = tripFactory.getAllTrips($scope.username);
    };
    $scope.getAllTrips();
  });
