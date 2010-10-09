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

