KEYS = {};
KEYS.W = 87;
KEYS.A = 65;
KEYS.S = 83;
KEYS.D = 68;

PLAYER_COLLISION_SAFETY = 12;
PLAYER_DASH_SPEED = 10;
PLAYER_MOVE_SPEED = 4;
ENEMY_MOVE_SPEED = 2;

function Game() {
    this.player = new Ninja(200, 200);
    this.enemies = [];
    this.allies = [];
    this.score = 0;

    this.allies.push(new Ally(300, 250));
    this.allies.push(new Ally(330, 230));
    this.allies.push(new Ally(350, 260));
    this.allies.push(new Ally(320, 270));

    // map of keycodes, either missing or "true" if currently pressed down
    this.keyMap = {};
    this.ticks = 0;
};

Game.prototype.init = function() {
};

Game.prototype.tick = function() {
    if (this.gameover) {
	this.draw();
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
	    this.gameoverReason = "You have been slain.";
	}
	for (var j = 0; j < this.allies.length; j++) {
	    var ally = this.allies[j];
	    if (enemy.position.dist(ally.position) < enemy.size + ally.size) {
		game.allies.splice(j, 1);
		j--;

		game.enemies.splice(i, 1);
		i--;
		break;
	    }
	}
    }

    if (this.allies.length == 0) {
	this.gameover = true;
	this.gameoverReason = "All villagers have been slain.";
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

    for (var i = 0; i < this.allies.length; i++) {
	var ally = this.allies[i];
	ally.draw(context, ally.position.x, ally.position.y, 10, "#77D");	    
    }

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
	    enemy.draw(context, x, y, 10, "#F00");
	} else {
	    enemy.draw(context, enemy.position.x, enemy.position.y, 10);
	}
    }

    this.player.draw(context);

    if (this.gameover) {
	context.fillStyle = "#FFF";
	context.font = "bold 32px sans-serif";
	context.fillText("You have shamed ninja kind!", 100, 150);

	context.font = "bold 22px sans-serif";

	if (this.gameoverReason) {
	    context.fillText(this.gameoverReason, 100, 200);
	}

	context.fillText("Your honor score was: " + this.score, 100, 230);

	context.fillText("[reload to play again]", 100, 260);
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

    document.onmousedown = function(event) {
	thiz.player.dash(new Position(event.x, event.y));
    }

    setInterval(function() { thiz.tick() }, 1000 / 60);
};

var game = new Game();
game.init();