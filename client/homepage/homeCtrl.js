angular.module('roadtrippin.home', [])
  .controller('homeController', function($scope, $window, mapFactory, tripFactory) {
    $scope.savedRoutes = [];
    $scope.input = {
      tripname: '',
      start: '',
      end: '',
      inviteFields: ['']
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
      var tripObject = {
        username: $scope.username,
        tripname: $scope.input.tripname,
        users: $scope.input.inviteFields,
      };
      if($scope.input.start && $scope.input.end) {
        $window.localStorage.setItem('initialStart', $scope.input.start);
        $window.localStorage.setItem('initialEnd', $scope.input.start);
        $window.localStorage.setItem('initialStops', 5);
      }
      tripFactory.addTrip(tripObject);
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
