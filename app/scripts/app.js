
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
