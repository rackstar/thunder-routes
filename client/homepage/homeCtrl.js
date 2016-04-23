angular.module('roadtrippin.home', [])
  .controller('homeController', function($scope, $window, mapFactory, tripFactory) {
    $scope.savedRoutes = [];
    $scope.input = {
<<<<<<< Updated upstream
      tripname: '',
      start: '',
      end: '',
      inviteFields: ['']
=======
      tripname: ''
>>>>>>> Stashed changes
    };
    $scope.isTripsClosed = false;
    $scope.isCreateClosed = false;
    $scope.username = $window.localStorage.getItem('username')

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
