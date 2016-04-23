// TO DO - add module to app.js
angular.module('chat', [])
  .factory('socket', socket);

var socket = function() {
  var socket = io.connect('http://localhost:3000');
  return socket;
});