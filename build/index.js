(function() {
  'use strict';
  var e, error, module;

  module = null;

  try {
    module = angular.module('ndx');
  } catch (error) {
    e = error;
    module = angular.module('ndx', []);
  }

  module.factory('ndxIdle', function($timeout, $injector, $window) {
    var auth, lastMove, logoutFn, logoutTime, move, reset, tick, timedOut, timeoutFn, timeoutTime;
    auth = $injector.has('auth') ? $injector.get('auth') : {
      getUser: function() {
        return true;
      }
    };
    lastMove = new Date().valueOf();
    timedOut = false;
    timeoutTime = 1000 * 60 * 60;
    logoutTime = 1000 * 60 * 70;
    timeoutFn = null;
    logoutFn = function() {
      return auth.logOut();
    };
    move = function() {
      if (!timedOut) {
        return lastMove = new Date().valueOf();
      }
    };
    $window.addEventListener('mousemove', move);
    $window.addEventListener('keydown', move);
    tick = function() {
      if (auth.getUser()) {
        if (!timedOut) {
          if (new Date().valueOf() - lastMove > timeoutTime) {
            timedOut = true;
            if (typeof timeoutFn === "function") {
              timeoutFn(timeoutTime);
            }
          }
        } else {
          if (new Date().valueOf() - lastMove > logoutTime) {
            if (typeof logoutFn === "function") {
              logoutFn();
            }
            reset();
          }
        }
      }
      return $timeout(tick, 1000 * 20);
    };
    tick();
    reset = function() {
      timedOut = false;
      return lastMove = new Date().valueOf();
    };
    return {
      setTimeoutTime: function(timeMins) {
        return timeoutTime = 1000 * 60 * timeMins;
      },
      setLogoutTime: function(timeMins) {
        return logoutTime = 1000 * 60 * timeMins;
      },
      setTimeoutFn: function(fn) {
        return timeoutFn = fn;
      },
      setLogoutFn: function(fn) {
        return logoutFn = fn;
      },
      reset: reset
    };
  });

}).call(this);

//# sourceMappingURL=index.js.map
