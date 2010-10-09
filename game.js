KEYS = {};
KEYS.W = 87;
KEYS.A = 65;
KEYS.S = 83;
KEYS.D = 68;

function Game() {
    this.player = new Ninja(200, 200);

    // map of keycodes, either missing or "true" if currently pressed down
    this.keyMap = {};
};

Game.prototype.init = function() {

};

Game.prototype.tick = function() {

    var moveSpeed = 5;

    var movingHorizontally = this.keyMap[KEYS.A] || this.keyMap[KEYS.D];
    var movingVertically = this.keyMap[KEYS.W] || this.keyMap[KEYS.S];
    if (movingHorizontally && movingVertically) {
	moveSpeed *= 1 / Math.sqrt(2);
    }

    if (this.keyMap[KEYS.W]) this.player.position.y -= moveSpeed;
    if (this.keyMap[KEYS.A]) this.player.position.x -= moveSpeed;
    if (this.keyMap[KEYS.S]) this.player.position.y += moveSpeed;
    if (this.keyMap[KEYS.D]) this.player.position.x += moveSpeed;
    this.draw();
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

    context.fillStyle = "#000";
    context.fillRect(this.player.position.x,
		     this.player.position.y,
		     20,
		     20);
};

Game.prototype.init = function() {
    var thiz = this;
    document.onkeydown = function(event) {
	thiz.keyMap[event.keyCode] = true;
    }

    document.onkeyup = function(event) {
	thiz.keyMap[event.keyCode] = false;
    }

    setInterval(function() { thiz.tick() }, 1000 / 60);
};

var game = new Game();
game.init();