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

Position.prototype.minDistFromEdge = function() {
    var xLeft = this.x;
    var xRight = 640 - this.x

    var yTop = this.y;
    var yBot = 480 - this.y;

    var xMax = Math.max(xLeft, xRight);
    var yMax = Math.max(yTop, yBot);
    return Math.max(xMax, yMax);
};

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
    this.comboCounter = 0;
    this.position = new Position(x, y);
    this.prevPosition = this.position;

    this.dashPosition = null;
    this.dashIndex = 0;
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
    this.dashIndex++;
};

Ninja.prototype.tick = function() {
    if (this.dashPosition) {
	if (this.position.dist(this.dashPosition) < PLAYER_DASH_SPEED) {
	    this.position = this.dashPosition;
	    this.dashPosition = null;
	    this.comboCounter = 0;
	} else {
	    this.position.moveTowards(this.dashPosition, PLAYER_DASH_SPEED);
	}
	for (var i = 0; i < game.enemies.length; i++) {
	    var enemy = game.enemies[i];
	    var dist = this.position.dist(enemy.position);
	    if (dist <= (this.size + enemy.size + SLASH_WIDTH)) {
		if (enemy.hit("player", this.dashIndex)) {
		    game.playSound("enemydeath.mp3");
		    game.enemies.splice(i, 1);
		    i--;
		    game.gameMode.tempScore += 1 + this.comboCounter;
		    game.gameMode.kills++;
		    this.comboCounter++;
		    game.fadingMessages.push(
			new FadingMessage(this.comboCounter + " honor",
					  12 + this.comboCounter * 2,
					  game.ticks + TICKS_PER_SECOND * 1, 
					  new Position(enemy.position.x - enemy.size / 2,
						       enemy.position.y + enemy.size / 4),
					  "#FC0",
					  true));
		}
	    }
	};
	for (var i = 0; i < game.allies.length; i++) {
	    var ally = game.allies[i];
	    var dist = this.position.dist(ally.position);
	    if (dist <= (this.size + ally.size)) {
		game.playSound("villagerdeath.mp3");
		game.allies.splice(i, 1);
		i--;
		game.tempScore--;
	    }
	};
    }
};

Ninja.prototype.draw = function(context) {
    // Draw three sweet motion trails
    if (this.dashPosition) {
	context.shadowOffsetX = 0;
	context.shadowOffsetY = 0;
	context.shadowBlur = 10;
	context.shadowColor = "white";

	var dx = this.position.x - this.dashPosition.x;
	var dy = this.position.y - this.dashPosition.y;
	var dist = this.position.dist(this.dashPosition);

	var unitDx = dx / dist;
	var unitDy = dy / dist;
	
	var trailLength = Math.min(110);
	var trailOffsetX = dx / dist * trailLength;
	var trailOffsetY = dy / dist * trailLength;

	context.globalAlpha = 0.5;
	context.strokeStyle = "#FFF";
	context.fillStyle = "#000";

	context.beginPath();
	context.moveTo(this.position.x, this.position.y);
	context.lineTo(this.position.x + trailOffsetX,
		       this.position.y + trailOffsetY);

	var motionLineOffset = 5;

	trailLength = trailLength * 0.75;
	trailOffsetX = dx / dist * trailLength;
	trailOffsetY = dy / dist * trailLength;

	context.moveTo(this.position.x + motionLineOffset * -unitDy, 
		       this.position.y + motionLineOffset * unitDx);
	context.lineTo(this.position.x + trailOffsetX + motionLineOffset * -unitDy,
		       this.position.y + trailOffsetY + motionLineOffset * unitDx);

	context.moveTo(this.position.x + motionLineOffset * unitDy, 
		       this.position.y + motionLineOffset * -unitDx);
	context.lineTo(this.position.x + trailOffsetX + motionLineOffset * unitDy,
		       this.position.y + trailOffsetY + motionLineOffset * -unitDx);
	context.closePath();


	context.lineWidth = 2;
	context.stroke();
	
	context.fill();
	context.globalAlpha = 1.0;
	context.shadowColor = "transparent";
    }

    // draw dude on top of motion lines
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
