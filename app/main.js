

    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create ,update : update });
    var enemies = [];
    var player;
    var obstacles = [];
    var ai;
    var player_sprite;
    function preload () {
        game.load.image('logo', 'phaser.png');
        game.load.image('enemy','img/enemy_test.png');
        game.load.image('player','img/player.jpeg');
        
    }

    function create () {
    	var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');
        logo.anchor.setTo(0.5, 0.5);
		player_sprite = game.add.sprite(game.world.centerX,game.world.centerY,'player');
        game.physics.enable([player_sprite],Phaser.Physics.ARCADE);
		player = new Player(game,player_sprite);

    	ai = new AIController(game,enemies,player,obstacles);
        
        
       
        for(var i = 0; i < 10; i ++){
        	enemies[i] = game.add.sprite(game.world.bounds.x / 10, game.world.centerY,'enemy' );
        }
    }

    function update(){
    	ai.update();
    	player.update();
    }


