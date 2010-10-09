KEYS = {};
KEYS.W = 87;
KEYS.A = 65;
KEYS.S = 83;
KEYS.D = 68;

PLAYER_COLLISION_SAFETY = 3;
PLAYER_DASH_SPEED = 10;
PLAYER_MOVE_SPEED = 5;
ENEMY_MOVE_SPEED = 3;

function Game() {
    this.player = new Ninja(200, 200);
    this.enemies = [];
    // map of keycodes, either missing or "true" if currently pressed down
    this.keyMap = {};
    this.ticks = 0;
};

Game.prototype.init = function() {
};

Game.prototype.tick = function() {
    if (this.gameover) {
	return;
    }
    this.ticks++;
    var x = -1;
    var y = -1;
    // Occasionally spawn enemies
    if (this.ticks % 50 == 0) {
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
	this.enemies.push(enemy);
    }

    this.movePlayer();

    for (var i = 0; i < this.enemies.length; i++) {
	var enemy = this.enemies[i];
	enemy.tick();
	if (enemy.position.dist(this.player.position) <=
	    (enemy.size + this.player.size - PLAYER_COLLISION_SAFETY)) {
	    this.gameover = true;
	}
    }

    this.player.tick();
    this.draw();
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

    if (this.keyMap[KEYS.W]) this.player.position.y -= moveSpeed;
    if (this.keyMap[KEYS.A]) this.player.position.x -= moveSpeed;
    if (this.keyMap[KEYS.S]) this.player.position.y += moveSpeed;
    if (this.keyMap[KEYS.D]) this.player.position.x += moveSpeed;
};

Game.prototype.drawEnemy = function(context, x, y, width, fillColor) {
    context.strokeStyle = "#000000";
    if (fillColor) {
	context.fillStyle = fillColor;
    } else {
	context.fillStyle = "#333";
    }
    context.beginPath();
    context.arc(x,y,width,0,Math.PI*2,true);
    context.lineWidth = 2
    context.closePath();
    context.stroke();
    context.fill();
};

Game.prototype.drawPlayer = function(context) {
    context.strokeStyle = "#000000";
    context.fillStyle = "#733";
    context.beginPath();
    context.arc(this.player.position.x,this.player.position.y,10,0,Math.PI*2,true);
    context.lineWidth = 2
    context.closePath();
    context.stroke();
    context.fill();
};

Game.prototype.draw = function() {
    var canvas = document.getElementById('gameCanvas');
    if(!canvas.getContext) {
	return;
    }
    var context = canvas.getContext('2d');

    context.fillStyle = "#A78D84";

    var canvasWidth = canvas.offsetWidth;
    var canvasHeight = canvas.offsetHeight;
    context.fillRect(0,
		     0,
		     canvasWidth,
		     canvasHeight);

    for (var i = 0; i < this.enemies.length; i++) {
	var enemy = this.enemies[i];
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
	    this.drawEnemy(context, x, y, 10, "#F00");
	} else {
	    this.drawEnemy(context, enemy.position.x, enemy.position.y, 10);
	}
    }

    this.drawPlayer(context);

    if (this.gameover) {
	context.fillStyle = "#FFF";
	context.font = "bold 32px sans-serif";
	context.fillText("You have shamed ninja kind!", 100, 200);
	context.font = "bold 22px sans-serif";
	context.fillText("[reload to play again]", 220, 250);
    }
};

Game.prototype.init = function() {
    var thiz = this;
    document.onkeydown = function(event) {
	thiz.keyMap[event.keyCode] = true;
    }

    document.onkeyup = function(event) {
	thiz.keyMap[event.keyCode] = false;
    }

    document.onclick = function(event) {
	thiz.player.dashPosition = new Position(event.x, event.y);
    }

    setInterval(function() { thiz.tick() }, 1000 / 60);
};

var game = new Game();
game.init();