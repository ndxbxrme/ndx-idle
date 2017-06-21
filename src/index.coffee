'use strict'
module = null
try
  module = angular.module 'ndx'
catch e
  module = angular.module 'ndx', []
module.factory 'ndxIdle', ($timeout, $injector, $window) ->
  auth = if $injector.has('Auth') then $injector.get('Auth') else
    getUser: ->
      true
  lastMove = new Date().valueOf()
  timedOut = false
  timeoutTime = 1000 * 60 * 60
  logoutTime = 1000 * 60 * 70
  timeoutFn = null
  logoutFn = ->
    auth.logOut()
  move = ->
    if not timedOut
      lastMove = new Date().valueOf()
  $window.addEventListener 'mousemove', move
  $window.addEventListener 'keydown', move
  tick = ->
    if auth.getUser()
      if not timedOut
        if new Date().valueOf() - lastMove > timeoutTime
          timedOut = true
          timeoutFn? timeoutTime
      else
        if new Date().valueOf() - lastMove > logoutTime
          logoutFn?()
          reset()
    $timeout tick, 1000 * 20
  tick()
  reset = ->
    timedOut = false
    lastMove = new Date().valueOf()
  
  setTimeoutTime: (timeMins) ->
    timeoutTime = 1000 * 60 * timeMins
  setLogoutTime: (timeMins) ->
    logoutTime = 1000 * 60 * timeMins
  setTimeoutFn: (fn) ->
    timeoutFn = fn
  setLogoutFn: (fn) ->
    logoutFn = fn
  reset: reset