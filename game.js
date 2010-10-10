KEYS = {};
KEYS.W = 87;
KEYS.A = 65;
KEYS.S = 83;
KEYS.D = 68;
KEYS.ENTER = 13;

PLAYER_COLLISION_SAFETY = 3;
PLAYER_DASH_SPEED = 10;
PLAYER_MOVE_SPEED = 4;
ENEMY_MOVE_SPEED = 2;

TICKS_PER_SECOND = 60;

function Game() {
    this.player = new Ninja(200, 200);

    // map of keycodes, either missing or "true" if currently pressed down
    this.keyMap = {};
    this.ticks = 0;

    this.villageSprite = new Image();
    this.villageSprite.src = "images/village.png";
};

Game.prototype.init = function() {
    this.titleMode = new TitleMode();
    this.titleMode.init();
    this.activeMode = this.titleMode;

    this.gameMode = new GameMode();
    this.gameOverMode = new GameOverMode();

    var thiz = this;
    document.onkeydown = function(event) {
	thiz.keyMap[event.keyCode] = true;
    }

    document.onkeyup = function(event) {
	thiz.keyMap[event.keyCode] = false;
    }

    document.onmousedown = function(event) {
	thiz.player.dash(new Position(event.x, event.y));
    }

    setInterval(function() { thiz.tick() }, 1000 / TICKS_PER_SECOND);
};

function TitleMode() {
};

TitleMode.prototype.init = function() {
    game.player.x = 300;
    game.player.y = 200;
};

TitleMode.prototype.draw = function() {
    var context = game.getContext();
    game.drawBackground(context);
    context.fillStyle = "#FFF";
    context.font = "bold 48px sans-serif";
    context.fillText("Ninja Leap", 100, 150);

    context.font = "bold 22px sans-serif";

    context.fillText("WASD to move, click to ninja leap", 100, 260);
    context.fillText("Press [enter] to play", 100, 300);
    game.player.draw(context);
};

TitleMode.prototype.tick = function() {
    this.draw();
    if (game.keyMap[KEYS.ENTER]) {
	game.gameMode.init();
	game.activeMode = game.gameMode;
    }
};

function GameOverMode() {
};

GameOverMode.prototype.init = function() {
};

GameOverMode.prototype.draw = function() {
    var context = game.getContext();
    game.gameMode.draw(context);

    context.fillStyle = "#FFF";
    context.font = "bold 32px sans-serif";
    context.shadowOffsetX = 3;
    context.shadowOffsetY = 3;
    context.shadowBlur = 4;
    context.shadowColor = "black";
    context.fillText("You have shamed ninja kind!", 100, 150);

    context.font = "bold 22px sans-serif";

    if (game.gameoverReason) {
	context.fillText(game.gameoverReason, 100, 200);
    }

    context.fillText("Your honor score was: " + game.score, 100, 230);
    context.fillText("Press [enter] to play again]", 100, 290);
    context.shadowColor = "transparent";
};

GameOverMode.prototype.tick = function() {
    this.draw();
    if (game.keyMap[KEYS.ENTER]) {
	game.gameMode.init();
	game.activeMode = game.gameMode;
    }
};

function GameMode() {
};

GameMode.prototype.init = function() {
    game.keyMap = {};
    game.enemies = [];
    game.allies = [];
    game.score = 0;
    game.gameover = false;
    game.player.dashPosition = null;
    game.ticks = 0;

    game.allies.push(new Ally(280, 210));
    game.allies.push(new Ally(295, 255));
    game.allies.push(new Ally(310, 220));
    game.allies.push(new Ally(330, 245));
    game.allies.push(new Ally(340, 200));
    game.allies.push(new Ally(355, 230));

    this.superSpawnThreshold = 20;
    this.spawnEnemy();
};

GameMode.prototype.draw = function() {
    var context = game.getContext();
    game.drawBackground(context);
    game.drawVillage(context);

    for (var i = 0; i < game.allies.length; i++) {
	var ally = game.allies[i];
	ally.draw(context, ally.position.x, ally.position.y);
    }

    for (var i = 0; i < game.enemies.length; i++) {
	var enemy = game.enemies[i];
	if (enemy.position.x < -enemy.size ||
	    enemy.position.y < -enemy.size ||
	    enemy.position.x > 640 + enemy.size ||
	    enemy.position.y > 480 + enemy.size) {
	    var x = enemy.position.x;
	    var y = enemy.position.y
	    if (x < -enemy.size) x = 0;
	    if (y < -enemy.size) y = 0;
	    if (x > 640 + enemy.size) x = 640;
	    if (y > 480 + enemy.size) y = 480;
	    enemy.draw(context, x, y, 10, "#F00");
	} else {
	    enemy.draw(context, enemy.position.x, enemy.position.y, 10);
	}
    }

    context.fillStyle = "#000";
    context.font = "bold 16px sans-serif";
    context.fillText("Honor: " + game.score, 10, 20);
    game.player.draw(context);
};

GameMode.prototype.spawnEnemy = function() {
    var x = -1;
    var y = -1;

    // Occasionally spawn enemies
    if (Math.random() > 0.5) {
	// generating on top or bottom
	x = (Math.random() > 0.5) ? -100 : 640 + 100;
	y = Math.random() * 480;
    } else {
	// generating on left or right
	// generating on top or bottom
	y = (Math.random() > 0.5) ? -100 : 480 + 100;
	x = Math.random() * 640;
    }

    var enemy = new Enemy(x, y);
    game.enemies.push(enemy);
};

GameMode.prototype.elapsedSeconds = function() {
    return game.ticks / TICKS_PER_SECOND;
};

GameMode.prototype.spawnRate = function() {
    if (game.score < 1) return TICKS_PER_SECOND * 5;
    if (game.score < 10) return TICKS_PER_SECOND * 1.5;
    if (game.score < 30) return TICKS_PER_SECOND * 1.2;
    if (game.score < 60) return TICKS_PER_SECOND;
    if (game.score < 90) return TICKS_PER_SECOND * 0.8;
    if (game.score < 200) return TICKS_PER_SECOND * 0.6;
    return TICKS_PER_SECOND * 0.4;
};

GameMode.prototype.tick = function() {
    if (game.gameover) {
	game.activeMode = game.gameOverMode;
	return;
    }
    game.ticks++;
    if (game.ticks % this.spawnRate() == 0) {
	this.spawnEnemy();
    }
    // Spawn N extra enemies every 3 seconds
    if (game.score > this.superSpawnThreshold) {
	this.superSpawnThreshold += 20;
	for(var i = 0; i < 4; i++) {
	    this.spawnEnemy()
	}
    }

    game.movePlayer();

    for (var i = 0; i < game.enemies.length; i++) {
	var enemy = game.enemies[i];
	enemy.tick();
	if (enemy.position.dist(game.player.position) <=
	    (enemy.size + game.player.size - PLAYER_COLLISION_SAFETY)) {
	    game.gameover = true;
	    game.gameoverReason = "You have been slain.";
	}
	for (var j = 0; j < game.allies.length; j++) {
	    var ally = game.allies[j];
	    if (enemy.position.dist(ally.position) < enemy.size + ally.size) {
		game.allies.splice(j, 1);
		j--;

		game.enemies.splice(i, 1);
		i--;
		break;
	    }
	}
    }

    if (game.allies.length == 0) {
	game.gameover = true;
	game.gameoverReason = "All villagers have been slain.";
    }

    game.player.tick();
    this.draw();
};


Game.prototype.tick = function() {
    this.activeMode.tick();
    return;
};

Game.prototype.movePlayer = function() {
    if (this.player.dashPosition) {
	return;
    }
    // player motion
    var moveSpeed = PLAYER_MOVE_SPEED;
    var movingHorizontally = this.keyMap[KEYS.A] || this.keyMap[KEYS.D];
    var movingVertically = this.keyMap[KEYS.W] || this.keyMap[KEYS.S];
    if (movingHorizontally && movingVertically) {
	moveSpeed *= 1 / Math.sqrt(2);
    }

    if (this.keyMap[KEYS.W]) this.player.position.move(0, -moveSpeed);
    if (this.keyMap[KEYS.A]) this.player.position.move(-moveSpeed, 0);
    if (this.keyMap[KEYS.S]) this.player.position.move(0, moveSpeed);
    if (this.keyMap[KEYS.D]) this.player.position.move(moveSpeed, 0);
};

Game.prototype.drawVillage = function(context) {
    this.cornerX = 320 - this.villageSprite.width / 2;
    this.cornerY = 240 - this.villageSprite.height / 2;
    context.drawImage(this.villageSprite, this.cornerX, this.cornerY);

    /*
    context.strokeStyle = "#5C4033";
    context.fillStyle = "#855E42";
    context.beginPath();
    context.arc(320, 240,60,0,Math.PI*2,true);
    context.lineWidth = 3
    context.closePath();
    context.stroke();
    context.fill();
    */
};

Game.prototype.drawBackground = function(context) {
    //context.fillStyle = "#A78D84";
    context.fillStyle = "#64CE52";

    // Clear canvas
    var canvasWidth = 640;
    var canvasHeight = 480;
    context.fillRect(0,
		     0,
		     canvasWidth,
		     canvasHeight);
};

Game.prototype.getContext = function() {
    var canvas = document.getElementById('gameCanvas');
    if(!canvas.getContext) {
	return;
    }
    var context = canvas.getContext('2d');
    return context;
};

Game.prototype.draw = function() {
    var context = game.getContext();
    this.activeMode.draw(context);
    return;
};

//Game.prototype.init = function() {
//};

var game = new Game();
game.init();