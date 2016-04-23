angular.module('chatFactory', [])
  .factory('socket', function() {
    var socket = io.connect('http://localhost:8080');
    return socket;
  }); 