function AIController(game, enemies, player, obstacles) {
    this.game = game;
    this.enemies = enemies;
    this.player = player;
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
    if (!enemy.aiVelocity) {
        enemy.aiVelocity = new Phaser.Point(0,0);
        enemy.x = this.game.rnd.integerInRange(0,this.game.width);
        enemy.y = this.game.rnd.integerInRange(0,this.game.height);

        enemy.aiAcceleration = new Phaser.Point();
    }

    var player_location = new Phaser.Point(this.game.input.x,this.game.input.y);

    enemy.aiAcceleration.x = player_location.x - enemy.x;
    enemy.aiAcceleration.y = player_location.y - enemy.y;
    enemy.aiAcceleration.setMagnitude(this.ENEMY_aiAcceleration);

    enemy.aiVelocity = Phaser.Point.add(enemy.aiAcceleration, enemy.aiVelocity, enemy.aiVelocity);
    if (enemy.aiVelocity.getMagnitude() > this.ENEMY_SPEED) {
        enemy.aiVelocity.setMagnitude(this.ENEMY_SPEED);
    }

    enemy.x += enemy.aiVelocity.x;
    enemy.y += enemy.aiVelocity.y;

}
