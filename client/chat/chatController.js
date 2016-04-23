var app = angular.module('chat', []);

app.factory('socket', function() {
    var socket = io.connect();
    return socket;
  });

app.controller('chatCtrl', function($scope, socket) {
    $scope.messages = [];

    $scope.sendMsg  = function($event) {
      $scope.data = {
        // trip_id: trip_id
        username: 'rocky',
        message: $scope.data.message
      };
      console.log($scope.data, 'scope data');
      socket.emit('new message', $scope.data);
      
      $event.preventDefault();
    };

    socket.on('message saved', function(msg) {
      console.log(msg, 'msg front-end');
      $scope.messages.push(msg);
      temp = msg;
      console.log($scope.messages)
      $scope.$digest();
    });

    console.log($scope.messages);
    console.log($scope.data);

});