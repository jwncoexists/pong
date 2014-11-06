(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';

    if (has(cache, path)) return cache[path].exports;
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex].exports;
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  var list = function() {
    var result = [];
    for (var item in modules) {
      if (has(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.list = list;
  globals.require.brunch = true;
})();
require.register("scripts/app", function(exports, require, module) {

$(document).ready(function() {
  // initialize player's paddle
  var numLosses = 0; // displayed in the stats
  var startTime = $.now();
  var endTime = startTime;
  var maxDuration = 0; //displayed in the stats
  var playerLost = false;
  var lostPause = 4000; //wait 4 seconds after we lose
  var paddlePad = 10; // padding around paddle to check for a miss

// update player's paddle location based on mouse location
  function updatePaddleLocation(paddle, event) {
     var offsetY = Math.max(10, event.pageY);
     offsetY = Math.min(360, offsetY);
     $(paddle).css("top", offsetY);
   }

  // initialize player's paddle with mousemove event
  function setupPlayerPaddle() { 
     // bind updatePaddleLocation to mouse click events
     console.log('setting up player paddle');
     $('.pong-container').mousemove(function(event) {
       updatePaddleLocation('.player', event);
     });

  } 

  // come here when a player loses
  function playerLoses() {
    playerLost = true;
    endTime = $.now();
    var duration = endTime - startTime;
    
    // update global variable maxDuration & stats display
    maxDuration = Math.max(duration, maxDuration);
    $('#max-duration').text(maxDuration/1000 + " seconds");
    
    // turn off ball animation & display
    $('.ball').css("display", "none");
    $('.ball').css("animation-play-state", "paused");
    $('.ball').css("-webkit-animation-play-state", "paused");  $('.vertical').css("animation-play-state", "paused");
    $('.vertical').css("-webkit-animation-play-state", "paused");

    // turn off animation of computer's paddle
    $('.computer').css("animation-play-state", "paused");
    $('.computer').css("-webkit-animation-play-state", "paused");
    
    // increment numLosses global variable & stats display
    numLosses += 1;
    $('#num-player-losses').text(numLosses);
  }

  // startup game again
  // come here after a loss and wait time is complete
  function restartGame() {
    startTime = $.now();
    endTime = startTime;
    playerLost = false;
    $('.ball').css("display", "block");
    $('.ball').css("animation-play-state", "running");
    $('.ball').css("-webkit-animation-play-state", "running");
    $('.vertical').css("animation-play-state", "running");
    $('.vertical').css("-webkit-animation-play-state", "running");
    $('.computer').css("animation-play-state", "running");
    $('.computer').css("-webkit-animation-play-state", "running");
  }

  // check to see if we've been paused long enough
  function checkResetTime() {
    var now = $.now();  
    if (now - endTime >= lostPause) {
      restartGame();
    }
  }

  // update duration display on screen
  function updateDuration() {
     var duration = ($.now() - startTime)/1000;
     $('#duration').text(duration + " seconds");
  }

  // check to see if ball has missed player's paddle
  function checkBallLocation() {
     var pos = $('.ball').position();
     var ballX = pos.left;
     var ballY = pos.top;
     var paddlePos = $('.player').position();
    
     // check to see if ball got past player's paddle
     if (ballX >= 975) {
       var ymin = paddlePos.top;
       var ymax = ymin + 50;
       if (ballY < (ymin-paddlePad) || ballY > (ymax+paddlePad) ) {
           playerLost = true;
       }
     }
  }
  
  setupPlayerPaddle();

  // setup timer to check ball location every 15 milliseconds
  var myInterval = window.setInterval(function() {
    if (!playerLost) {
      checkBallLocation();
      if (playerLost) {
        playerLoses();
      } else {
        updateDuration();
      }
    }
    else {
      checkResetTime();
    }
  }, 15);

});

});

;
//# sourceMappingURL=app.js.map