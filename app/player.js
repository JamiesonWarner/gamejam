function Player(game, player ){
	this.game = game;
	this.player = player;
}

Player.prototype.update = function(){
	game.physics.arcade.moveToPointer(player,400);
	if(Phaser.Rectangle.contains(player.body,game.input.x, game.input.y)){
		player.body.velocity.setTo(0,0);
	}
}