function Enemy(x, y) {
    this.position = new Position(x, y);
    this.size = 10;
};

Enemy.prototype.tick = function() {
    this.position.moveTowards(game.player.position, ENEMY_MOVE_SPEED);
};

function Ally(x, y) {
    this.position = new Position(x, y);
    this.size = 10;
};

Ally.prototype.tick = function() {
};