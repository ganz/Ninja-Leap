function Game() {
};

Game.prototype.init = function() {
};

Game.prototype.tick = function() {
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
    context.fillRect(0,
		     0,
		     50,
		     50);
};

Game.prototype.init = function() {
    var thiz = this;
    setInterval(function() { thiz.tick() }, 1000 / 60);
};

var game = new Game();
game.init();