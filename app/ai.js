function AIController(game, enemies, player, obstacles) {
    this.game = game;
    this.enemies = enemies;
    this.player = player;
    this.obstacles = obstacles;

    this.ENEMY_SPEED = 5;
    this.ENEMY_ACCELERATION = .1;
}

AIController.prototype.update = function () {
    // Add acceleration vector to enemies if they don't have one already
    for (var i = 0; i < this.enemies.length; i++) {
        var enemy = this.enemies[i];
        this.update_enemy(enemy);
    }
}

AIController.prototype.update_enemy = function(enemy) {
    if (!enemy.velocity) {
        enemy.velocity = new Phaser.Point(0,0);
        enemy.x = this.game.rnd.integerInRange(0,this.game.width);
        enemy.y = this.game.rnd.integerInRange(0,this.game.height);

        enemy.acceleration = new Phaser.Point();
    }

    var player_location = new Phaser.Point(this.game.input.x,this.game.input.y);

    enemy.acceleration.x = player_location.x - enemy.x;
    enemy.acceleration.y = player_location.y - enemy.y;
    enemy.acceleration.setMagnitude(this.ENEMY_ACCELERATION);

    enemy.velocity = Phaser.Point.add(enemy.acceleration, enemy.velocity, enemy.velocity);
    if (enemy.velocity.getMagnitude() > this.ENEMY_SPEED) {
        enemy.velocity.setMagnitude(this.ENEMY_SPEED);
    }

    enemy.x += enemy.velocity.x;
    enemy.y += enemy.velocity.y;

}
