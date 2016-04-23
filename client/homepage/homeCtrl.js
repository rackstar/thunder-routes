angular.module('roadtrippin.home', [])
  .controller('homeController', function($scope, mapFactory) {


    $scope.signout = function () {
      mapFactory.signout();
    };
  });
