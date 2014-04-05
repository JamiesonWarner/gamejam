function AIController(game, enemies, player, obstacles) {
    this.game = game;
    this.enemies = enemies;
    this.player = player.player;
    this.obstacles = obstacles;

    this.ENEMY_SPEED = 400;
    this.ENEMY_aiAcceleration = 10;
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
        enemy.rotationOffset = this.game.rnd.integerInRange(0,360);
        enemy.aiAcceleration = new Phaser.Point();
    }

    enemy.aiAcceleration.x = this.player.x - enemy.x;
    enemy.aiAcceleration.y = this.player.y - enemy.y;
    enemy.aiAcceleration.setMagnitude(this.ENEMY_aiAcceleration);

    enemy.body.velocity = Phaser.Point.add(enemy.aiAcceleration, enemy.body.velocity, enemy.body.velocity);
    if (enemy.body.velocity.getMagnitude() > this.ENEMY_SPEED) {
        enemy.body.velocity.setMagnitude(this.ENEMY_SPEED);
    }

    this.face_sprite(enemy,enemy.body.velocity.x, enemy.body.velocity.y);

}

AIController.prototype.face_sprite = function(sprite, x, y) {
    sprite.angle = Math.atan2(y,x)*180 / Math.PI + sprite.rotationOffset;
}