angular.module('chatCtrl')

  .controller('chatCtrl', function($scope, socket) {
    $scope.messages = [];

    $scope.sendMsg = function() {
      socket.emit('new message', $scope.msg.text);
    }

    socket.on('message saved', function(msg) {
      $scope.messages.push(msg);
    })
  })