function AIController(game, enemies, player, obstacles) {
    this.game = game;
    this.enemies = enemies;
    this.player = player;
    this.obstacles = obstacles;

    this.ENEMY_SPEED = 5;
}

AIController.prototype.update = function () {
    // Add acceleration vector to enemies if they don't have one already
    for (var i = 0; i < this.enemies.length; i++) {
        var enemy = enemies[i];
        this.update_enemy(enemy);
    }
}

AIController.prototype.update_enemy = function(enemy) {
    if (!enemy.velocity) {
        enemy.velocity = new Point(0,0);
    }

    var player_location = new Point(0,0);
    enemy.velocity = player_location.subtract(enemy.velocity,enemy.world).
                        normalize().
                        multiply(new Point(this.ENEMY_SPEED, this.ENEMY_SPEED));

    enemy.x += enemy.velocity.x;
    enemy.y += enemy.velocity.y;

}
