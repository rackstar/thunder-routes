var app = angular.module('roadtrippin.chatFactory', []);

app.factory('socket', function() {
    var socket = io.connect();
    return socket;
});

app.factory('chatFactory', function($http) {
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
})

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