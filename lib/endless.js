import Board from "./board";
import Game from "./game";


let currTime = new Date().getTime();
const BUFFER = 100;
const MODEL_TYPES = {
  IMU: 0,
  EMG: 1
}
const MODEL_CLASSES = {
  IMU: ['left_forward', 'right_forward', 'left_side', 'right_side', 'left_back', 'right_back'],
  EMG: ['left_forward', 'right_forward', 'left_side', 'right_side', 'left_back', 'right_back']
}

function _processPredictions(modelType, data) {
  const preds = [];
  const predsList = data.replace(/\s/g,'').split('|');
  for (const p of predsList) {
      let [predClass, conf, _] = p.split(','); // have _ to catch any gunk (even though it shouldn't exist)
      predClass = predClass.split('=').slice(-1).pop(0).toLowerCase();

      if (modelType == MODEL_TYPES.IMU) {
        if (MODEL_CLASSES.IMU.includes(predClass)) {
          // name, confidence
          preds.push({'class': predClass, 'confidence': conf.split('=').slice(-1).pop(0)});
        }
      } else if (modelType == MODEL_TYPES.EMG) {
        if (MODEL_CLASSES.EMG.includes(predClass)) {
          // name, confidence
          preds.push({'class': predClass, 'confidence': conf.split('=').slice(-1).pop(0)});
        }
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

  document.querySelector('#tutorialmodal button').addEventListener('click', () => {
    game.closeTutorialModal();
  });

  // instantiate Cionic SDK
  const cionic = new cionicjs.Cionic({
    streamLogger: function(msg, cls) {
        var logDiv = document.getElementById('log');
        logDiv.innerHTML += '<div class="'+cls+'">&gt;&nbsp;' + msg + '</div>';
        logDiv.scrollTop = logDiv.scrollHeight;
  }});

  // add Cionic listeners
  cionic.registerWebRTCHandler(cionicjs.DATA_TRACKS.QUAT_GW, (data) => {
    // we don't do anything with this data so ignore it
  });
  cionic.registerWebRTCHandler(cionicjs.DATA_TRACKS.ADC_GW, (data) => {
      // we don't do anything with this data so ignore it
  });
  cionic.registerWebRTCHandler(cionicjs.DATA_TRACKS.CMD_GW, function (data) {
  var cmdJson = JSON.parse(data);
  var cmd = cmdJson['cmd'];
  console.log(cmdJson);

  if (cmd === 'monitorkey') {
    // left side
    if (cmdJson.hasOwnProperty('37')) {
        var isPressed = cmdJson['37'];
        if (isPressed === 'ON') {
          game.check(game.LleftArrows, 'l_left');
        }
    }

    // right side
    else if (cmdJson.hasOwnProperty('39')) {
        var isPressed = cmdJson['39'];
        if (isPressed === 'ON') {
          game.check(game.RrightArrows, 'r_right');
        }
    }

    // right back
    else if (cmdJson.hasOwnProperty('40')) {
        var isPressed = cmdJson['40']
        if (isPressed === 'ON') {
          game.check(game.RdownArrows, 'r_down');
        }
    }

    // right forward
    else if (cmdJson.hasOwnProperty('38')) {
        var isPressed = cmdJson['38'];
        if (isPressed === 'ON') {
          game.check(game.RupArrows, 'r_up');
        }
    }

    // left forward
    else if (cmdJson.hasOwnProperty('81')) {
      var isPressed = cmdJson['81'];
      if (isPressed === 'ON') {
        game.check(game.LupArrows, 'l_up');
      }
    }

    // left back
    else if (cmdJson.hasOwnProperty('90')) {
      var isPressed = cmdJson['81'];
      if (isPressed === 'ON') {
        game.check(game.LdownArrows, 'l_down');
      }
    }
  }

  else if (cmd === 'recstart') {
    game.play('standard');
  }

  else if (cmd === 'predictions') {
    var type = cmdJson['type'];
    var preds;    
    
    if (type === 'imu') {
      preds = _processPredictions(MODEL_TYPES.IMU, cmdJson['predictions']);
    }
    else if (type === 'emg') {
      preds = _processPredictions(MODEL_TYPES.EMG, data);
    }

    if (!preds) return

    game.showFeedback = true;
    let timeNow = new Date().getTime();
    if (timeNow > BUFFER + currTime) {
      for (let pred of preds) {
        if (pred['confidence'] > 0.85) {
          if (pred['class'] == 'left_forward') game.check(game.LupArrows, 'l_up');
          if (pred['class'] == 'right_forward') game.check(game.RupArrows, 'r_up');
          if (pred['class'] == 'left_side') game.check(game.LleftArrows, 'l_left');
          if (pred['class'] == 'right_back') game.check(game.RdownArrows, 'r_down');
          if (pred['class'] == 'left_back' ) game.check(game.LdownArrows, 'l_down');
          if (pred['class'] == 'right_side') game.check(game.RrightArrows, 'r_right');
        }
      }
      currTime = timeNow;
    }

  }

  });

  game.addCionic(cionic);

  const monitorAPI = new cionicjs.MonitorAPI({});
  monitorAPI.addPlayer(cionic);
  monitorAPI.main();
});
