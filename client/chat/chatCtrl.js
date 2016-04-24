var app = angular.module('chat', []);

app.factory('socket', function() {
    var socket = io.connect();
    return socket;
  });

app.directive('scrollBottom', function () {
  return {
    scope: {
      scrollBottom: "="
    },
    link: function (scope, element) {
      scope.$watchCollection('scrollBottom', function (newValue) {
        if (newValue)
        {
          $(element).scrollTop($(element)[0].scrollHeight);
        }
      });
    }
  }
});

app.directive('a', function() {
    return {
        restrict: 'E',
        link: function(scope, elem, attrs) {
            if(attrs.ngClick || attrs.href === '#collapseOne' || attrs.href === '#'){
                elem.on('click', function(e){
                    e.preventDefault();
                });
            }
        }
   };
});

app.controller('chatController', function($scope, socket) {
    $scope.messages = [];

    $scope.sendMsg  = function($event) {
      $scope.data = {
        // trip_id: trip_id
        username: 'rocky',
        message: $scope.data.message
      };
      socket.emit('new message', $scope.data);
      $scope.data.message = '';
      $event.preventDefault();
    };

    socket.on('message saved', function(msg) {
      // msg.time = moment().fromNow()
      $scope.messages.push(msg);
      $scope.$digest();
    });

    console.log($scope.messages);
    console.log($scope.data);

    $scope.getChat = function() {
      // TO DO - get chat upon load
    }
});