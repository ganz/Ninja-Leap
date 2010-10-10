var SLASH_WIDTH = 5;

function Position(x, y) {
    this.x = this.prevX = x;
    this.y = this.prevY = y;
    this.facing = 1; // 0 = left, 1 = right
};

Position.prototype.dist = function(position) {
    var a = this.x - position.x;
    var b = this.y - position.y;
    return Math.sqrt(a * a + b * b);
};

Position.prototype.saveState = function() {
    this.prevX = this.x;
    this.prevY = this.y;
}

Position.prototype.move = function(xDist, yDist) {
    this.saveState();
    this.x += xDist;
    this.y += yDist;

    if (this.x < this.prevX) {
	this.facing = 0;
    }
    else if (this.x > this.prevX) {
	this.facing = 1;
    }
};

Position.prototype.moveTowards = function(position, magnitude) {
    this.saveState();

    var dx = position.x - this.x;
    var dy = position.y - this.y;

    var dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > magnitude) {
	this.x = this.x + (magnitude / dist) * dx;
	this.y = this.y + (magnitude / dist) * dy;
    } else {
	this.x = position.x;
	this.y = position.y;
    }
    if (this.x < this.prevX) {
	this.facing = 0;
    }
    else if (this.x > this.prevX) {
	this.facing = 1;
    }
};

function Ninja(x, y) {
    this.position = new Position(x, y);
    this.prevPosition = this.position;

    this.dashPosition = null;
    this.size = 12;

    this.frames = [];
    this.frames[0] = new Image();
    this.frames[0].src = "images/ninja1.gif";
    this.frames[1] = new Image();
    this.frames[1].src = "images/ninja2.gif";
    this.frameIndex = 0;
    this.frameLength = 200;
    this.time = new Date().getTime();

    this.lframes = [];
    this.lframes[0] = new Image();
    this.lframes[0].src = "images/ninja1l.gif";
    this.lframes[1] = new Image();
    this.lframes[1].src = "images/ninja2l.gif";
    this.frameIndex = 0;
    this.frameLength = 200;
};

Ninja.prototype.dash = function(position) {
    this.dashPosition = position;
    this.position.moveTowards(this.dashPosition, PLAYER_DASH_SPEED)
};

Ninja.prototype.tick = function() {
    if (this.dashPosition) {
	if (this.position.dist(this.dashPosition) < PLAYER_DASH_SPEED) {
	    this.position = this.dashPosition;
	    this.dashPosition = null;
	} else {
	    this.position.moveTowards(this.dashPosition, PLAYER_DASH_SPEED);
	}
	for (var i = 0; i < game.enemies.length; i++) {
	    var enemy = game.enemies[i];
	    var dist = this.position.dist(enemy.position);
	    if (dist <= (this.size + enemy.size + SLASH_WIDTH)) {
		game.enemies.splice(i, 1);
		i--;
		game.score++;
	    }
	};
	for (var i = 0; i < game.allies.length; i++) {
	    var ally = game.allies[i];
	    var dist = this.position.dist(ally.position);
	    if (dist <= (this.size + ally.size)) {
		game.allies.splice(i, 1);
		i--;
		game.score--;
	    }
	};
    }
};

Ninja.prototype.draw = function(context) {
    var cornerX = this.position.x - this.size;
    var cornerY = this.position.y - this.size;
    if (this.position.facing == 1) {
	context.drawImage(this.frames[this.frameIndex], cornerX, cornerY,
			  this.size * 2, this.size * 2);
    } else if (this.position.facing == 0) {
	context.drawImage(this.lframes[this.frameIndex], cornerX, cornerY,
			  this.size * 2, this.size * 2);
    }
    
    var newTime = new Date().getTime();
    if (newTime - this.time >= this.frameLength) {
	this.frameIndex = (this.frameIndex + 1) % this.frames.length;
	this.time = newTime;
    }
};
