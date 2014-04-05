function AIController(game, enemies, player, obstacles) {
    this.game = game;
    this.enemies = enemies;
    this.player = player.player;
    this.obstacles = obstacles;

    this.ENEMY_SPEED = 5;
    this.ENEMY_aiAcceleration = .1;
}

AIController.prototype.update = function () {
    // Add aiAcceleration vector to enemies if they don't have one already
    for (var i = 0; i < this.enemies.length; i++) {
        var enemy = this.enemies[i];
        this.update_enemy(enemy);
    }
}

AIController.prototype.update_enemy = function(enemy) {
    if (!enemy.aiAcceleration) {
        enemy.x = this.game.rnd.integerInRange(0,this.game.width);
        enemy.y = this.game.rnd.integerInRange(0,this.game.height);

        enemy.aiAcceleration = new Phaser.Point();
    }

    enemy.aiAcceleration.x = this.player.x - enemy.x;
    enemy.aiAcceleration.y = this.player.y - enemy.y;
    enemy.aiAcceleration.setMagnitude(this.ENEMY_aiAcceleration);

    enemy.velocity = Phaser.Point.add(enemy.aiAcceleration, enemy.velocity, enemy.velocity);
    if (enemy.velocity.getMagnitude() > this.ENEMY_SPEED) {
        enemy.velocity.setMagnitude(this.ENEMY_SPEED);
    }

    enemy.x += enemy.velocity.x;
    enemy.y += enemy.velocity.y;

}
