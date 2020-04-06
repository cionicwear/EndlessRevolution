import Board from "./board";
import Game from "./game";


let currTime = new Date().getTime();
const BUFFER = 250;

function _processPredictions(data) {
  const preds = [];
  const predsList = data.replace(/\s/g,'').split('|');
  for (const p of predsList) {
      let [predClass, conf, _] = p.split(','); // have _ to catch any gunk (even though it shouldn't exist)
      predClass = predClass.split('=').slice(-1).pop(0).toLowerCase();

      if (['forward', 'side', 'back', 'center'].includes(predClass)) {
          // name, confidence
          preds.push({'class': predClass, 'confidence': conf.split('=').slice(-1).pop(0)});
      }
  }

  return preds;
}

document.addEventListener("DOMContentLoaded", function () {
  const stage = new createjs.Stage("canvas");
  const board = new Board(stage);
  window.board = board;
  board.draw();
  stage.update();

  const game = new Game(stage);

  function LhandlePress(e) {
    if (game.started) {
      switch (e.keyCode) {
        case 97:
          game.check(game.LleftArrows, "l_left");
          break;
        case 115:
          game.check(game.LdownArrows, "l_down");
          break;
        case 119:
          game.check(game.LupArrows, "l_up");
          break;
        case 100:
          game.check(game.LrightArrows, "l_right");
          break;
      }
    }
  }

  function RhandlePress(e) {
    if (game.started) {
      switch (e.keyCode) {
        case 106:
          game.check(game.RleftArrows, "r_left");
          break;
        case 107:
          game.check(game.RdownArrows, "r_down");
          break;
        case 105:
          game.check(game.RupArrows, "r_up");
          break;
        case 108:
          game.check(game.RrightArrows, "r_right");
          break;
      }
    }
  }

  document.getElementById("light").addEventListener("click", () => {
    game.play("light");
  });
  document.getElementById("standard").addEventListener("click", () => {
    game.play("standard");
  });
  document.getElementById("heavy").addEventListener("click", () => {
    game.play("heavy");
  });

  document.addEventListener("keypress", LhandlePress, false);
  document.addEventListener("keypress", RhandlePress, false);

  // instantiate Cionic SDK
  const cionic = new cionicjs.Cionic({
    streamLogger: function(msg, cls) {
        var logDiv = document.getElementById('log');
        logDiv.innerHTML += '<div class="'+cls+'">&gt;&nbsp;' + msg + '</div>';
        logDiv.scrollTop = logDiv.scrollHeight;
  }});

  // add Cionic listeners
  cionic.Stream.registerListener('left', function(isPressed) {
    if (isPressed === 'ON') {
      game.check(game.RleftArrows, 'r_left');
    }
  });

  cionic.Stream.registerListener('right', function(isPressed) {
    if (isPressed === 'ON') {
      game.check(game.RrightArrows, 'r_right');
    }
  });

  cionic.Stream.registerListener('up', function(isPressed) {
    if (isPressed === 'ON') {
      game.check(game.RupArrows, 'r_up');
    }
  });

  cionic.Stream.registerListener('down', function(isPressed) {
    if (isPressed === 'ON') {
      game.check(game.RdownArrows, 'r_down');
    }
  });

  cionic.addListener('imu_preds', function(data) {
    let timeNow = new Date().getTime();
    if (timeNow > BUFFER + currTime) {
      let preds = _processPredictions(data);
      for (let pred of preds) {
        if (pred['confidence'] > 0.70) {
          if (pred['class'] == 'forward') game.check(game.RupArrows, 'r_up');
          if (pred['class'] == 'side') game.check(game.RleftArrows, 'r_left');
          if (pred['class'] == 'back') game.check(game.RdownArrows, 'r_down');
          if (pred['class'] == 'center') game.check(game.RrightArrows, 'r_right');
        }
      }
      currTime = timeNow;
    }
  });

  cionic.addListener('emg_preds', function(data) {
    let timeNow = new Date().getTime();
    if (timeNow > BUFFER + currTime) {
      let preds = _processPredictions(data);
      for (let pred of preds) {
        if (pred['confidence'] > 0.70) {
          if (pred['class'] == 'left_forward' || pred['class'] == 'right_forward') game.check(game.RupArrows, 'r_up');
          if (pred['class'] == 'left_side') game.check(game.RleftArrows, 'r_left');
          if (pred['class'] == 'left_back' || pred['class'] == 'right_back') game.check(game.RdownArrows, 'r_down');
          if (pred['class'] == 'right_side') game.check(game.RrightArrows, 'r_right');
        }
      }
      currTime = timeNow;
    }
  });

  // connect to the gateway
  document.getElementById('cionic-connect').onclick = function () {
    let host = document.getElementById('host').value;
    cionic.websocket(host);
  };

  const monitorAPI = new cionicjs.MonitorAPI({});
  monitorAPI.addPlayer(cionic);
  monitorAPI.main();
});
