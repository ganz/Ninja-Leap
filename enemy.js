function Enemy(x, y) {
    this.position = new Position(x, y);
    this.size = 15;

    this.frames = [];
    this.frames[0] = new Image();
    this.frames[0].src = "images/businessgoblin1.png";
    this.frames[1] = new Image();
    this.frames[1].src = "images/businessgoblin2.png";
    this.frameIndex = 0;
    this.frameLength = 100;
    this.time = new Date().getTime();
};

Enemy.prototype.tick = function() {
    this.position.moveTowards(game.player.position, ENEMY_MOVE_SPEED);
};

Enemy.prototype.draw = function(context, x, y, width, fillColor) {
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

// args: hitter: what hit this enemy?
//   values: "player", "arrow"
// returns true if dead, false if not dead
Enemy.prototype.hit = function(hitter) {
    return true;
}

function Barbar(x, y) {
    this.position = new Position(x, y);
    this.size = 20;

    this.frames = [];
    this.frames[0] = new Image();
    this.frames[0].src = "images/hairybarbar1.png";
    this.frames[1] = new Image();
    this.frames[1].src = "images/hairybarbar2.png";
    this.frameIndex = 0;
    this.frameLength = 400;
    this.time = new Date().getTime();

    this.hitpoints = 2;
    this.lastDashHitBy = -1;
};

Barbar.prototype.tick = function() {
    var centerPosition = new Position(320, 240);
    this.position.moveTowards(centerPosition, BARBAR_MOVE_SPEED);
    
};

Barbar.prototype.draw = function(context, x, y, width, fillColor) {
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

// args: hitter: what hit this enemy?
//   values: "player", "arrow"
// optional second arg: dashIndex
//   required if hitter == "player"
//   indicates which dash is hitting, so we can ignore multiple hits from the same dash
// returns true if dead, false if not dead
Barbar.prototype.hit = function(hitter, dashIndex) {
    if (hitter == "player" && dashIndex > this.lastDashHitBy) {
	this.hitpoints--;
	this.lastDashHitBy = dashIndex;
    }
    if (this.hitpoints <= 0) {
	return true;
    }
    return false;
}

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



function Arrow(pos, target) {
    this.position = pos;
    this.target = target;
    this.active = true;
    this.age = 0;

    var dx = this.position.x - this.target.x;
    var dy = this.position.y - this.target.y;
    var dist = this.position.dist(this.target);

    var arrowLength = 15
    this.tailOffsetX = dx / dist * arrowLength;
    this.tailOffsetY = dy / dist * arrowLength;
};

Arrow.prototype.tick = function() {
    if (this.age > 600) {
	return;
    }
    this.age++;
    if (this.position.x == this.target.x &&
	this.position.y == this.target.y) {
	this.active = false
    }
    if (!this.active) {
	return;
    }
    this.position.moveTowards(this.target, 6);

};

Arrow.prototype.draw = function(context, x, y) {    
    context.lineWidth = 1
    context.globalAlpha = 1 - this.age / 600;
    context.strokeStyle = "#000000";
    context.fillStyle = "#333";
    context.beginPath();
    context.moveTo(this.position.x, this.position.y);

    context.lineTo(this.position.x + this.tailOffsetX,
		   this.position.y + this.tailOffsetY);
    context.closePath();
    context.stroke();

    context.arc(this.target.x,this.target.y,2,0,Math.PI*2,true);
    context.fill();
    context.globalAlpha = 1.0;
};