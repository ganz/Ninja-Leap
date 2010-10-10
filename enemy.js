function Enemy(x, y) {
    this.position = new Position(x, y);
    this.size = 10;
};

Enemy.prototype.tick = function() {
    this.position.moveTowards(game.player.position, ENEMY_MOVE_SPEED);
};

Enemy.prototype.draw = function(context, x, y, width, fillColor) {
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

function Ally(x, y) {
    this.position = new Position(x, y);
    this.size = 15;

    this.frames = [];
    this.frames[0] = new Image();
    this.frames[0].src = "images/villager1.png";
    this.frames[1] = new Image();
    this.frames[1].src = "images/villager2.png";
    this.frameIndex = 0;
    this.frameLength = 500;
    this.time = new Date().getTime();
};

Ally.prototype.tick = function() {
};

Ally.prototype.draw = function(context, x, y) {    
    var cornerX = x - this.size;
    var cornerY = y - this.size;
    context.drawImage(this.frames[this.frameIndex], cornerX, cornerY,
		      this.size * 2, this.size * 2);

    var newTime = new Date().getTime();
    if (newTime - this.time >= this.frameLength) {
	this.frameIndex = (this.frameIndex + 1) % this.frames.length;
	this.time = newTime;
    }
};