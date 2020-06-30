import Arrow from "./arrow";

class Game {
  constructor(stage) {
    this.lastArrow = -1;
    this.stage = stage;
    this.started = false;
    this.LleftArrows = [];
    this.LdownArrows = [];
    this.LupArrows = [];
    this.LrightArrows = [];
    this.RleftArrows = [];
    this.RdownArrows = [];
    this.RupArrows = [];
    this.RrightArrows = [];
    this.play = this.play.bind(this);
    this.gameOver = this.gameOver.bind(this);
    this.music = new Audio('assets/songs/embody.mp3');
    this.music.volume = 0 //0.2;
    this.inTutorial = false;
    this.tick = createjs.Ticker
    this.speed = 0
    this.reset();
    document.getElementById("mute")
      .addEventListener("click", () => {
        if (this.music.muted) {
          $("i").removeClass("fa fa-volume-off");
          $("i").addClass("fa fa-volume-up");
        } else {
          $("i").removeClass("fa fa-volume-up");
          $("i").addClass("fa fa-volume-off");
        }
        this.music.muted = !this.music.muted;
      });

      this.RcreateLeftArrow = this.RcreateLeftArrow.bind(this);
      this.RcreateDownArrow = this.RcreateDownArrow.bind(this);
      this.RcreateUpArrow = this.RcreateUpArrow.bind(this);
      this.RcreateRightArrow = this.RcreateRightArrow.bind(this);
      this.LcreateLeftArrow = this.LcreateLeftArrow.bind(this);
      this.LcreateDownArrow = this.LcreateDownArrow.bind(this);
      this.LcreateUpArrow = this.LcreateUpArrow.bind(this);
      this.LcreateRightArrow = this.LcreateRightArrow.bind(this);

      this.randomGen = this.randomGen.bind(this);
    }

  reset() {
    this.score = 0;
    this.life = 10000;
    this.updateScore();
    this.clearArrows();
    createjs.Ticker.removeAllEventListeners();
    this.stage.update();
    clearInterval(this.myInt);
  }

  clearArrows() {
    this.LleftArrows.forEach(arrow => { this.stage.removeChild(arrow); });
    this.LdownArrows.forEach(arrow => { this.stage.removeChild(arrow); });
    this.LupArrows.forEach(arrow => { this.stage.removeChild(arrow); });
    this.LrightArrows.forEach(arrow => { this.stage.removeChild(arrow); });
    this.RleftArrows.forEach(arrow => { this.stage.removeChild(arrow); });
    this.RdownArrows.forEach(arrow => { this.stage.removeChild(arrow); });
    this.RupArrows.forEach(arrow => { this.stage.removeChild(arrow); });
    this.RrightArrows.forEach(arrow => { this.stage.removeChild(arrow); });
    this.LleftArrows = [];
    this.LdownArrows = [];
    this.LupArrows = [];
    this.LrightArrows = [];
    this.RleftArrows = [];
    this.RdownArrows = [];
    this.RupArrows = [];
    this.RrightArrows = [];
  }

  LcreateLeftArrow() {
    let leftMovingArrow = new Arrow.LleftArrow();
    this.LleftArrows.push(leftMovingArrow);
    this.stage.addChild(leftMovingArrow);
    this.stage.update();
    let listener = this.tick.on("tick", leftTick.bind(this));
    leftMovingArrow.listener = listener;

    function leftTick(event) {
      leftMovingArrow.y = leftMovingArrow.y - this.speed;
      if (this.LleftArrows[0] && this.LleftArrows[0].y < -40) {
        this.miss();
        this.stage.removeChild(this.LleftArrows[0]);
        this.LleftArrows.shift();
        this.tick.off("tick", listener);
      }
      this.stage.update(event);
    }
  }

  LcreateDownArrow() {
    let downMovingArrow = new Arrow.LdownArrow();
    this.LdownArrows.push(downMovingArrow);
    this.stage.addChild(downMovingArrow);
    this.stage.update();
    let listener = this.tick.on("tick", downTick.bind(this));
    downMovingArrow.listener = listener;

    function downTick(event) {
      downMovingArrow.y = downMovingArrow.y - this.speed;
      if (this.LdownArrows[0] && this.LdownArrows[0].y < -40) {
        this.miss();
        this.stage.removeChild(this.LdownArrows[0]);
        this.LdownArrows.shift();
        this.tick.off("tick", listener);
      }
      this.stage.update(event);
    }
  }

  LcreateUpArrow() {
    let upMovingArrow = new Arrow.LupArrow();
    this.LupArrows.push(upMovingArrow);
    this.stage.addChild(upMovingArrow);
    this.stage.update();
    let listener = this.tick.on("tick", upTick.bind(this));
    upMovingArrow.listener = listener;

    function upTick(event) {
      upMovingArrow.y = upMovingArrow.y - this.speed;
      if (this.LupArrows[0] && this.LupArrows[0].y < -40) {
        this.miss();
        this.stage.removeChild(this.LupArrows[0]);
        this.LupArrows.shift();
        this.tick.off("tick", listener);
      }
      this.stage.update(event);
    }
  }

  LcreateRightArrow() {
    let rightMovingArrow = new Arrow.LrightArrow();
    this.LrightArrows.push(rightMovingArrow);
    this.stage.addChild(rightMovingArrow);
    this.stage.update();
    let listener = this.tick.on("tick", rightTick.bind(this));
    rightMovingArrow.listener = listener;

    function rightTick(event) {
      rightMovingArrow.y = rightMovingArrow.y - this.speed;
      if (this.LrightArrows[0] && this.LrightArrows[0].y < -40) {
        this.miss();
        this.stage.removeChild(this.LrightArrows[0]);
        this.LrightArrows.shift();
        this.tick.off("tick", listener);
      }
      this.stage.update(event);
    }
  }

  RcreateLeftArrow() {
    let leftMovingArrow = new Arrow.RleftArrow();
    this.RleftArrows.push(leftMovingArrow);
    this.stage.addChild(leftMovingArrow);
    this.stage.update();
    let listener = this.tick.on("tick", leftTick.bind(this));
    leftMovingArrow.listener = listener;

    function leftTick(event) {
      leftMovingArrow.y = leftMovingArrow.y - this.speed;
      if (this.RleftArrows[0] && this.RleftArrows[0].y < -40) {
        this.miss();
        this.stage.removeChild(this.RleftArrows[0]);
        this.RleftArrows.shift();
        this.tick.off("tick", listener);
      }
      this.stage.update(event);
    }
  }

  RcreateDownArrow() {
    let downMovingArrow = new Arrow.RdownArrow();
    this.RdownArrows.push(downMovingArrow);
    this.stage.addChild(downMovingArrow);
    this.stage.update();
    let listener = this.tick.on("tick", downTick.bind(this));
    downMovingArrow.listener = listener;

    function downTick(event) {
      downMovingArrow.y = downMovingArrow.y - this.speed;
      if (this.RdownArrows[0] && this.RdownArrows[0].y < -40) {
        this.miss();
        this.stage.removeChild(this.RdownArrows[0]);
        this.RdownArrows.shift();
        this.tick.off("tick", listener);
      }
      this.stage.update(event);
    }
  }

  RcreateUpArrow() {
    let upMovingArrow = new Arrow.RupArrow();
    this.RupArrows.push(upMovingArrow);
    this.stage.addChild(upMovingArrow);
    this.stage.update();
    let listener = this.tick.on("tick", upTick.bind(this));
    upMovingArrow.listener = listener;

    function upTick(event) {
      upMovingArrow.y = upMovingArrow.y - this.speed;
      if (this.RupArrows[0] && this.RupArrows[0].y < -40) {
        this.miss();
        this.stage.removeChild(this.RupArrows[0]);
        this.RupArrows.shift();
        this.tick.off("tick", listener);
      }
      this.stage.update(event);
    }
  }

  RcreateRightArrow() {
    let rightMovingArrow = new Arrow.RrightArrow();
    this.RrightArrows.push(rightMovingArrow);
    this.stage.addChild(rightMovingArrow);
    this.stage.update();
    let listener = this.tick.on("tick", rightTick.bind(this));
    rightMovingArrow.listener = listener;

    function rightTick(event) {
      rightMovingArrow.y = rightMovingArrow.y - this.speed;
      if (this.RrightArrows[0] && this.RrightArrows[0].y < -40) {
        this.miss();
        this.stage.removeChild(this.RrightArrows[0]);
        this.RrightArrows.shift();
        this.tick.off("tick", listener);
      }
      this.stage.update(event);
    }
  }

  randomGen() {
    let randArrow;
    while (true) {
      randArrow = Math.floor(Math.random() * 4) + 1;
      if (randArrow != this.lastArrow) break;
    }
    this.lastArrow = randArrow;
    let randDouble = Math.random() * 100 + 1;
    // if (difficulty === "heavy") {
    //   if (randDouble > 75) {
    //     randArrow += 5;
    //   }
    // }

    switch(randArrow) {
      case 1: this.RcreateLeftArrow();  break;
      case 2: this.RcreateDownArrow();  break;
      case 3: this.RcreateUpArrow();    break;
      case 4: this.RcreateRightArrow(); break;
      case 5: break;
      case 6: this.LcreateLeftArrow();  break;
      case 7: this.LcreateDownArrow();  break;
      case 8: this.LcreateUpArrow();    break;
      case 9: this.LcreateRightArrow(); break;
      case 10: break;
    }
  }

  startTutorial() {
    this.inTutorial = true;

  }

  play(difficulty) {
    this.started = true;
    this.speed = 5;
    // switch(difficulty) {
    //   case "light":
    //     speed = 3.5;
    //     break;
    //   case "standard":
    //     speed = 7.0;
    //     break;
    //   case "heavy":
    //     speed = 7.0;
    //     break;
    // }

    this.reset();

    this.music.addEventListener("ended", this.gameOver)
    this.music.play();

    // new arrow every 3 seconds
    this.myInt = setInterval( this.randomGen, 3000);
    this.tick.setFPS(30);
  }

  check(arrows, direction) {
    let pressed;
    switch(direction) {
      case "l_left":
        pressed = new Arrow.LleftPressedArrow();
        break;
      case "l_down":
        pressed = new Arrow.LdownPressedArrow();
        break;
      case "l_up":
        pressed = new Arrow.LupPressedArrow();
        break;
      case "l_right":
        pressed = new Arrow.LrightPressedArrow();
        break;
      case "r_left":
        pressed = new Arrow.RleftPressedArrow();
        break;
      case "r_down":
        pressed = new Arrow.RdownPressedArrow();
        break;
      case "r_up":
        pressed = new Arrow.RupPressedArrow();
        break;
      case "r_right":
        pressed = new Arrow.RrightPressedArrow();
        break;
    }
    this.stage.addChild(pressed);
    this.stage.update();
    setTimeout( () => this.stage.removeChild(pressed), 100);

    // if (arrows[0] && arrows[0].y < 40 && arrows[0].y > 10) {
    if (arrows[0] && arrows[0].y < 200 && arrows[0].y > 50) {
      if (this.life > 0) {
        this.hit("excellent");
      }
      createjs.Ticker.off("tick", arrows[0].listener);
      this.stage.removeChild(arrows[0]);
      arrows.shift();
    } else if (arrows[0] && arrows[0].y < 55 && arrows[0].y > -5) {
      if (this.life > 0) {
        this.hit("great");
      }
      createjs.Ticker.off("tick", arrows[0].listener);
      this.stage.removeChild(arrows[0]);
      arrows.shift();
    } else if (this.life > 0) {
      this.miss();
    }
  }

  hit(tier) {
    let hitMessageBorder;
    let hitMessage;
    if (tier === "excellent") {
      this.score += 100;
      this.life = Math.max(200, this.life + 2);

      hitMessageBorder = new createjs.Text("Excellent!", "40px Impact", "black");
      hitMessageBorder.outline = 2;
      hitMessageBorder.x = 285;
      hitMessageBorder.y = 225;
      hitMessage = hitMessageBorder.clone();
      hitMessage.outline = 0;
      hitMessage.color = "#ffff80";
    } else if (tier === "great") {
      this.score += 50;
      this.life = Math.max(200, this.life + 1);

      hitMessageBorder = new createjs.Text("Great!", "40px Impact", "black");
      hitMessageBorder.outline = 2;
      hitMessageBorder.x = 310;
      hitMessageBorder.y = 225;
      hitMessage = hitMessageBorder.clone();
      hitMessage.outline = 0;
      hitMessage.color = "#80ff80";
    }

    this.stage.addChild(hitMessage, hitMessageBorder);
    this.stage.update();
    setTimeout( () => {
      this.stage.removeChild(hitMessage, hitMessageBorder);
    }, 200);

    this.updateScore();
  }

  miss() {
    let missMessageBorder = new createjs.Text("Missed...", "40px Impact", "black");
    missMessageBorder.outline = 2;
    missMessageBorder.x = 300;
    missMessageBorder.y = 275;
    let missMessage = missMessageBorder.clone();
    missMessage.outline = 0;
    missMessage.color = "red";
    this.stage.addChild(missMessage, missMessageBorder);
    this.stage.update();

    setTimeout( () => {
      this.stage.removeChild(missMessage, missMessageBorder);
    }, 200);
    if (this.life === 0) {
      this.gameOver();
      this.stage.removeChild(missMessage, missMessageBorder);
    }
  }

  gameOver() {
    let gameOverBorder = new createjs.Text("Game over!", "60px Impact", "black");
    gameOverBorder.outline = 2;
    gameOverBorder.x = 225;
    gameOverBorder.y = 275;
    let gameOver = gameOverBorder.clone();
    gameOver.outline = 0;
    gameOver.color = "red";
    this.stage.addChild(gameOver, gameOverBorder);
    this.stage.update();
    setTimeout(() => {
      this.stage.removeChild(gameOver, gameOverBorder);
    }, 5000);
    this.clearArrows();
    this.music.pause();
    clearInterval(this.myInt);
  }

  updateScore() {
    let score = document.getElementById("score");
    score.innerHTML = this.score;
  }
}

export default Game;
