angular.module('roadtrippin.authFactory', [])

.factory('authFactory', function($http, $location, $window) {
  var signin = function(user) {
    return $http({
      method: 'POST',
      url: '/signin',
      data: user
    })
    .then(function(res) {
      return res.data.token;
    })
    .catch(function(error) {
      console.log('ERROR: ', error);
      return { error: error.data.error };
    });
  };
  
  var signup = function(user) {
    return $http({
      method: 'POST',
      url: '/signup',
      data: user
    })
    .then(function(res) {
      return res.data.token;
    })
    .catch(function(error) {
      console.log('ERROR: ', error);
      return { error: error.data.error };
    });
  };
  
  var isAuth = function() {
    return !!$window.localStorage.getItem('com.roadtrippin');
  };

  var getCurrentUser = function() {
    return $window.localStorage.getItem('profile');
  };

  return {
    signin: signin,
    signup: signup,
    isAuth: isAuth,
    getCurrentUser: getCurrentUser
  };
});