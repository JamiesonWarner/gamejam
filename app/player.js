function Player(game, player ){
	this.game = game;
	this.player = player;
}

Player.prototype.update = function(){
	this.game.physics.arcade.moveToPointer(this.player,400);
	if(Phaser.Rectangle.contains(this.player.body,this.game.input.x, this.game.input.y)){
		this.player.body.velocity.setTo(0,0);
	}
}