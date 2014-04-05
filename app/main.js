window.onload = function() {

    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create ,update : update });
    var enemies = [];
    var player;
    var obstacles = [];
    var ai;
    function preload () {
        game.load.image('logo', 'phaser.png');
        game.load.image('enemy','img/enemy_test.png');
        ai = new AIController(game,enemies,player,obstacles);
    }

    function create () {

        var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');
        logo.anchor.setTo(0.5, 0.5);
        for(var i = 0; i < 10; i ++){
        	enemies[i] = game.add.sprite(game.world.bounds.x / 10, game.world.centerY,'enemy' )
        }

    }

    function update(){
    	ai.update();
    }

};
