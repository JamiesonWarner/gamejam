function Player(game, player ){
	this.game = game;
	this.player = player;
}

Player.prototype.update = function(){
    var distToCursor = Math.abs(this.game.input.mousePointer.worldY - this.player.y) + Math.abs(this.game.input.mousePointer.worldX - this.player.x);
    distToCursor *= 2;
    if (distToCursor > 400) {
        distToCursor = 400;
    }
    if (distToCursor < 20) {
        distToCursor = 1;
    }
	this.game.physics.arcade.moveToPointer(this.player,distToCursor);
	if(Phaser.Rectangle.contains(this.player.body,this.game.input.x, this.game.input.y)){
		this.player.body.velocity.setTo(0,0);
	}
}