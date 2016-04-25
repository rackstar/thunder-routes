var app = angular.module('chat', []);

app.factory('socket', function() {
    var socket = io.connect();
    return socket;
});

app.factory('chatFact', function($http) {
  return {
    getChat: function(tripId) {
      return $http({
          method: 'POST',
          url: '/chat',
          data: { trip_id: tripId }
        })
        .then(function(res) {
          return res.data;
        });
    }
  };
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

app.controller('chatController', function($scope, $stateParams, socket, chatFact, authFactory) {
    $scope.messages = [];
    $scope.username = authFactory.getCurrentUser();

    $scope.sendMsg  = function($event) {
      $scope.data = {
        trip_id: $stateParams.tripId,
        username: $scope.username,
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

    $scope.getChat = function(tripId) {
        chatFact.getChat($stateParams.tripId)      
          .then(function(messages) {
            $scope.messages = messages;
            console.log($scope.messages)
          });
    };
});
