KEYS = {};
KEYS.W = 87;
KEYS.A = 65;
KEYS.S = 83;
KEYS.D = 68;
KEYS.ENTER = 13;
KEYS.SPACE = 32;

PLAYER_COLLISION_SAFETY = 3;
PLAYER_DASH_SPEED = 15;
PLAYER_MOVE_SPEED = 4;
ENEMY_MOVE_SPEED = 2;
BARBAR_MOVE_SPEED = 0.5;

TICKS_PER_SECOND = 60;

function Game() {
    this.player = new Ninja(200, 200);

    // map of keycodes, either missing or "true" if currently pressed down
    this.keyMap = {};
    this.ticks = 0;

    this.villageSprite = new Image();
    this.villageSprite.src = "images/village.png";
    this.haySprite = new Image();
    this.haySprite.src = "images/haystack.png";
    this.backgroundImage = new Image();
    this.backgroundImage.src = "images/background.png";
};

Game.prototype.setHighScores = function(scores) {
    localStorage.setItem("highscores", scores);
}

Game.prototype.loadHighScores = function() {
    var scoresString = localStorage.getItem("highscores");
    if (!scoresString) {
	var oldScores = [["decent ninja", 12], ["bad ninja", 4]];
    }

    var scores = []
    var splitScores = scoresString.split(",");
    for (var i = 0; i < splitScores.length / 2; i++) {
	var scorePair = []
	scorePair = [splitScores[i * 2], parseInt(splitScores[i * 2 + 1])];
	scores.push(scorePair);
    }
    return scores;
}

Game.prototype.init = function() {
    this.highScores = this.loadHighScores();
    this.score = 0;
    this.fadingMessages = [];

    this.levels = [];
    var level = new Level();
    level.title = "Day One";
    level.neededKills = 5;
    level.description = "Protect the village!";
    level.enemySpawnRate = TICKS_PER_SECOND * 4;
    level.archerShootRate = TICKS_PER_SECOND * 2;
    level.barbarSpawnChance = 0.00;
    this.levels.push(level);

    level = new Level();
    level.title = "Day Two";
    level.neededKills = 10;
    level.description = "Save those villagers!";
    level.archerShootRate = TICKS_PER_SECOND;
    level.enemySpawnRate = TICKS_PER_SECOND * 2;
    level.barbarSpawnChance = 0.00;
    this.levels.push(level);

    level = new Level();
    level.title = "Day Three";
    level.neededKills = 20;
    level.description = "Defeat all invaders!";
    level.archerShootRate = TICKS_PER_SECOND * 0.5;
    level.enemySpawnRate = TICKS_PER_SECOND;
    level.barbarSpawnChance = 0.1;
    this.levels.push(level);

    level = new Level();
    level.title = "Day Four";
    level.neededKills = 40;
    level.description = "Defense! Defense!"
    level.archerShootRate = TICKS_PER_SECOND * 0.25;
    level.enemySpawnRate = TICKS_PER_SECOND * 0.8;
    level.barbarSpawnChance = 0.2;
    this.levels.push(level);

    level = new Level();
    level.title = "Last Day";
    level.neededKills = 60;
    level.description = "Final Wave! Time to flip out!";
    level.archerShootRate = TICKS_PER_SECOND * 0.125;
    level.enemySpawnRate = TICKS_PER_SECOND * 0.6;
    level.barbarSpawnChance = 0.2;
    this.levels.push(level);

    this.levelIndex = 0;

    game.levels= [game.levels[0]];

    this.loadSound("dash.mp3");
    this.loadSound("enemydeath.mp3");
    this.loadSound("villagerdeath.mp3");
    this.loadSound("arrow.mp3");

    this.titleMode = new TitleMode();
    this.titleMode.init();
    this.activeMode = this.titleMode;

    this.gameMode = new GameMode();
    this.gameOverMode = new GameOverMode();

    this.winMode = new WinMode();

    this.mousePos = new Position(-200, -200);
    
    var thiz = this;
    document.onkeydown = function(event) {
	thiz.keyMap[event.keyCode] = true;
    }

    document.onkeyup = function(event) {
	thiz.keyMap[event.keyCode] = false;
    }

    document.onmousedown = function(event) {
	thiz.playSound("dash.mp3");
	thiz.player.dash(new Position(event.x, event.y));
    }

    document.onmousemove = function(event) {
	thiz.mousePos.x = event.x;
	thiz.mousePos.y = event.y;
    }

    setInterval(function() { thiz.tick() }, 1000 / TICKS_PER_SECOND);
};

function Level() {
}

Game.prototype.loadSound = function(filename) {
    document["PlaySound"].loadSound(filename);
};

Game.prototype.playSound = function(filename) {
    document["PlaySound"].playSound(filename);
}

function WinMode() {
}

WinMode.prototype.init = function() {
};

WinMode.prototype.draw = function() {
    var context = game.getContext();
    game.drawBackground(context);

    context.fillStyle = "#FFF";
    context.font = "bold 48px sans-serif";
    context.fillText("YOU WIN", 100, 90);

    context.font = "bold 22px sans-serif";


    context.fillText("You earned " + game.score + " honor.", 100, 130);
    context.fillText("You are the greatest ninja ever.", 100, 155);
    context.fillText("Your honor is eternal.", 100, 180);
    context.fillText("The villagers apologize for the arrows.", 100, 205);

    context.fillStyle = "#FFF";
    context.font = "bold 28px sans-serif";
    context.fillText("High Scores", 100, 260);
    context.font = "bold 16px sans-serif";
    for (var i = 0; i < Math.min(10, game.highScores.length); i++) {
	var name = game.highScores[i][0];
	var score = game.highScores[i][1];
	context.fillText(name + " - " + score, 100, 280 + i * 20);
    }

    game.player.draw(context);
};

WinMode.prototype.tick = function() {
    this.draw();
    if (!this.name) {
	this.name = prompt("CONGRATS - what is your ninja name?","a ninja");
	game.highScores.push([this.name, game.score]);

	function sortnum(a, b) { return b[1] - a[1] };
	game.highScores = game.highScores.sort(sortnum);
	game.highScores = game.highScores.slice(0, 10);
	game.setHighScores(game.highScores);
    }
};

function TitleMode() {
};

TitleMode.prototype.init = function() {
    game.player.position.x = 115;
    game.player.position.y = 110;
    game.allies = [];
    game.enemies = [];
    this.enemy = new Enemy(200, 110);
    game.enemies.push(this.enemy);
};

TitleMode.prototype.draw = function() {
    var context = game.getContext();
    game.drawBackground(context);
    context.fillStyle = "#FFF";
    context.font = "bold 48px sans-serif";
    context.fillText("Ninja Leap", 100, 70);

    context.font = "bold 16px sans-serif";

    context.fillText("WASD to move, click to ninja leap", 100, 160);
    context.fillText("[ninja leap] through the enemy to start", 100, 180);

    game.drawRetical(context);

    for (var i = 0; i < game.enemies.length; i++) {
	var enemy = game.enemies[i];
	enemy.draw(context, enemy.position.x, enemy.position.y, 10);
    }

    context.fillStyle = "#FFF";
    context.font = "bold 28px sans-serif";
    context.fillText("High Scores", 100, 260);
    context.font = "bold 16px sans-serif";
    for (var i = 0; i < Math.min(10, game.highScores.length); i++) {
	var name = game.highScores[i][0];
	var score = game.highScores[i][1];
	context.fillText(name + " - " + score, 100, 280 + i * 20);
    }
    game.player.draw(context);
};

TitleMode.prototype.tick = function() {
    game.player.tick();
    this.draw();
    if (game.enemies.length == 0) {
	game.player.position.moveTowards(game.player.dashPosition, 20);
	game.player.dashPosition = null;
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
//    context.shadowOffsetX = 0;
//    context.shadowOffsetY = 0;
//    context.shadowBlur = 10;
//    context.shadowColor = "#555";
    context.fillText("You have shamed ninja kind!", 160, 80);

    context.font = "bold 22px sans-serif";

    if (game.gameoverReason) {
	context.fillText(game.gameoverReason, 160, 110);
    }

    context.fillText("Honor score reset to " + (game.score) + ", from " + (game.score + game.gameMode.tempScore), 160, 140);
    context.fillText("Press [space] to play again", 160, 400);
    context.shadowColor = "transparent";
};

GameOverMode.prototype.tick = function() {
    this.draw();
    if (game.keyMap[KEYS.SPACE]) {
	game.player.dashPosition = null;
	game.gameMode.init();
	game.activeMode = game.gameMode;
    }
};

function GameMode() {
};

GameMode.prototype.init = function() {
    game.keyMap = {};
    game.enemies = [];
    game.projectiles = [];
    game.allies = [];
    game.fadingMessages = []
//    game.score = 0;
    game.gameover = false;
    game.player.comboCounter = 0;
    game.ticks = 0;

    game.allies.push(new Ally(280, 210));
    game.allies.push(new Ally(295, 255));
    game.allies.push(new Ally(310, 220));
    game.allies.push(new Ally(330, 245));
    game.allies.push(new Ally(340, 200));
    game.allies.push(new Ally(355, 230));


    this.kills = 0;
    this.tempScore = 0;

    this.superSpawnThreshold = 20;
//    document.body.style.cursor = "none";


    game.fadingMessages.push(
	new FadingMessage(game.levels[game.levelIndex].title, 
			  32,
			  game.ticks + TICKS_PER_SECOND * 2, 
			  new Position(220, 100),
			  "#FFF"));
    game.fadingMessages.push(
	new FadingMessage(game.levels[game.levelIndex].description, 
			  24,
			  game.ticks + TICKS_PER_SECOND * 2, 
			  new Position(220, 130),
			  "#FFF"));
};

GameMode.prototype.draw = function() {
    var context = game.getContext();
    game.drawBackground(context);
    game.drawVillage(context);


    for (var i = 0; i < game.allies.length; i++) {
	var ally = game.allies[i];
	ally.draw(context, ally.position.x, ally.position.y);
    }

    game.drawRetical(context);

    for (var i = 0; i < game.projectiles.length; i++) {
	var projectile = game.projectiles[i];
	projectile.draw(context);
    }

    var centerPos = new Position(320, 240);
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
	    context.fillStyle = "red";
	    context.strokeStyle = "red";
	    context.shadowBlur = 5;
	    context.shadowColor = "red";
	    context.beginPath();
	    var dist = centerPos.dist(enemy.position);

	    var visDist = dist + enemy.size;
	    context.arc(x, y, 0.7 * visDist / 15 * (enemy.size * enemy.size / 225), 0, Math.PI * 2, true);


	    context.closePath();
	    context.fill();
	    //context.stroke();
	    context.shadowColor = "transparent";
	} else {
	    enemy.draw(context, enemy.position.x, enemy.position.y, 10);
	}
    }

    if (game.activeMode == this) {
	for (var i = 0; i < game.fadingMessages.length; i++) {
	    var msg = game.fadingMessages[i];
	    if (msg.expiration <= game.ticks) {
		game.fadingMessages.splice(i, 1);
		i--;
		continue;
	    }
	    msg.draw(context);
	}
    }


    context.fillStyle = "#FFF";
    context.font = "bold 16px sans-serif";
    context.fillText("Honor: " + (game.score + this.tempScore), 10, 20);
    context.fillText("Enemies left: " +  (game.levels[game.levelIndex].neededKills - this.kills),
		     10, 40);
    game.player.draw(context);
};

Game.prototype.drawRetical = function(context) {
    context.globalAlpha = 0.5;
    context.strokeStyle = "red";
    context.lineWidth = 4;

    context.beginPath();
    context.arc(game.mousePos.x, game.mousePos.y, 16, 0, Math.PI * 2, true);
    context.closePath();
    context.fillStyle = "white";
    context.fill();
    context.stroke();

    context.beginPath();
    context.arc(game.mousePos.x, game.mousePos.y, 9, 0, Math.PI * 2, true);
    context.closePath();
    context.stroke();

    context.beginPath();
    context.arc(game.mousePos.x, game.mousePos.y, 4, 0, Math.PI * 2, true);
    context.closePath();
    context.fillStyle = "red";
    context.fill();

    context.globalAlpha = 1.0;
};

GameMode.prototype.spawnEnemy = function(level) {
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
    
    var enemy;
    if (Math.random() <= level.barbarSpawnChance) {
	enemy = new Barbar(x, y);
    } else {
	enemy = new Enemy(x, y);
    }
    game.enemies.push(enemy);
};

GameMode.prototype.elapsedSeconds = function() {
    return game.ticks / TICKS_PER_SECOND;
};

GameMode.prototype.spawnRate = function() {
//    return game.levels[game.levelIndex].enemySpawnRate;
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

    if (this.kills >= game.levels[game.levelIndex].neededKills) {
	game.score += this.tempScore;
	if (game.levelIndex < game.levels.length - 1) {
	    game.levelIndex++;
	    this.init();
	} else {
	    game.winMode.init();
	    game.activeMode = game.winMode;
	}
    }

    game.ticks++;
    if (game.ticks % game.levels[game.levelIndex].enemySpawnRate == 0) {
	this.spawnEnemy(game.levels[game.levelIndex]);
    }

    // Spawn N extra enemies after M kills
    if (this.kills > this.superSpawnThreshold) {
	this.superSpawnThreshold += 20;
	for(var i = 0; i < 4; i++) {
	    this.spawnEnemy(game.levels[game.levelIndex]);
	}
    }

    if (game.ticks % game.levels[game.levelIndex].archerShootRate == 0 &&
	game.enemies.length > 0) {
	var ally = game.allies[parseInt(Math.random() * game.allies.length)];

	var nearestDist = 9999999;
	var nearestEnemy = null;
	var centerPos = new Position(320, 240);
	for (var i = 0; i < game.enemies.length; i++) {
	    var dist = centerPos.dist(game.enemies[i].position);
	    if (dist < nearestDist) {
		nearestDist = dist;
		nearestEnemy = game.enemies[i];
	    }
	}

	var DIST_TO_SHOOT_AT_ENEMY = 225;
	if (nearestDist > DIST_TO_SHOOT_AT_ENEMY) {
	    return;
	}

	var enemy = nearestEnemy;

	var start = new Position(ally.position.x, ally.position.y);
	var jitter = 40;
	var target = new Position(enemy.position.x + Math.random() * jitter - jitter / 2,
				  enemy.position.y + Math.random() * jitter - jitter / 2);
	var arrow = new Arrow(start, target);
	game.playSound("arrow.mp3");
	game.projectiles.push(arrow);
    }

    game.movePlayer();

    for (var i = 0; i < game.projectiles.length; i++) {
	if (game.projectiles[i].age >= 600) {
	    game.projectiles.splice(i, 1);
	    i--;
	    continue;
	}

	var projectile = game.projectiles[i];
	projectile.tick();

	if (!projectile.active) {
	    continue;
	}

	for (var j = 0; j < game.enemies.length; j++) {
	    var enemy = game.enemies[j];
	    if (projectile.position.dist(enemy.position) <= enemy.size) {
		if (enemy.hit("arrow")) {
		    game.enemies.splice(j, 1);
		    i--;
		    this.kills++;
		}
	    }
	}

	if (!game.player.dashPosition && game.player.position.dist(projectile.position)
	    <= game.player.size - PLAYER_COLLISION_SAFETY) {
	    game.gameover = true;
	    game.gameoverReason = "You have been slain by the villagers.";
	}
    }

    for (var i = 0; i < game.enemies.length; i++) {
	var enemy = game.enemies[i];
	enemy.tick();
	if (!game.player.dashPosition && 
	    enemy.position.dist(game.player.position) <=
	    (enemy.size + game.player.size - PLAYER_COLLISION_SAFETY)) {
	    game.gameover = true;
	    game.gameoverReason = "You have been slain by an enemy.";
	}
	for (var j = 0; j < game.allies.length; j++) {
	    var ally = game.allies[j];
	    if (enemy.position.dist(ally.position) < enemy.size + ally.size) {
		game.playSound("villagerdeath.mp3");
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


function FadingMessage(msg, size, expiration, position, color, shadow, shadowBlur) {
    this.msg = msg;
    this.size = size;
    this.expiration = expiration;
    this.position = position;
    this.color = color;
    this.shadow = shadow
    this.shadowBlur = shadowBlur;
};

FadingMessage.prototype.draw = function(context) {
    var secondsLeft = (this.expiration - game.ticks) / TICKS_PER_SECOND;
    var fractionLeft = secondsLeft / 1.0;
    fractionLeft = Math.min(fractionLeft, 1.0);

    if (this.shadow) {
	context.shadowOffsetX = 0;
	context.shadowOffsetY = 0;
	context.shadowBlur = this.shadowBlur ? this.shadowBlur : 10;
	context.shadowColor = '#555';
    }

    context.globalAlpha = fractionLeft;
    context.fillStyle = (this.color) ? this.color : "#FFF";

    context.font = "bold " + this.size + "px sans-serif";
    context.fillText(this.msg, this.position.x, this.position.y);

    if (this.shadow) {
	context.shadowColor = "transparent";
    }

    context.globalAlpha = 1.0;
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
    context.globalAlpha = 0.2;
    context.fillStyle = "#855E42";
    context.beginPath();
    context.arc(320, 240,100,0,Math.PI*2,true);
    context.closePath();
    context.fill();

    context.globalAlpha = 0.8;
    context.drawImage(this.haySprite, 240, 260, 42, 39);
    context.globalAlpha = 0.9;
    context.drawImage(this.haySprite, 260, 170, 45, 43);
    context.globalAlpha = 0.8;
    context.drawImage(this.haySprite, 300, 150, 36, 34);
    context.globalAlpha = 0.9;
    context.drawImage(this.haySprite, 300, 290, 33, 38);
    context.globalAlpha = 1.0;
    context.drawImage(this.haySprite, 366, 250, 40, 43);
    context.globalAlpha = 0.9;
    context.drawImage(this.haySprite, 370, 190, 41, 36);


};

Game.prototype.drawBackground = function(context) {
    //context.fillStyle = "#A78D84";
    //context.fillStyle = "#64CE52";
    //context.fillStyle = "#56b247";

    // Clear canvas
    /*
    var canvasWidth = 640;
    var canvasHeight = 480;
    context.fillRect(0,
		     0,
		     canvasWidth,
		     canvasHeight);
    */

    context.drawImage(this.backgroundImage, 0, 0);
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
function init() {
    game.init();
}
