

    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create ,update : update });
    var enemies = [];
    var player;
    var obstacles = [];
    var ai;
    var player_sprite;
    var lives = 3;

    var music;
    var playerDeathSound;
    var enemyDeathSound;
    var spawnSound;
    var gameOverSound;

    var liveSprites = [];
    function preload () {
        game.load.image('logo', 'phaser.png');
        game.load.image('enemy','img/astronaut.png');
        game.load.spritesheet('player','img/player.png', 102, 94);
        game.load.image('space', 'img/space.png');
        game.load.image('nebula', 'img/nebula.jpg');
        game.load.image('planet1','img/planet1.png');
        game.load.image('planet2','img/planet2.png');
        game.load.image('planet3','img/planet3.png');
        game.load.image('planet4','img/planet4.png');
        game.load.image('planet5','img/planet5.png');
        game.load.image('planet6','img/planet6.png');
        game.load.image('planet7','img/planet7.png');
        game.load.image('planet8','img/planet8.png');
        game.load.image('planet9','img/planet9.png');
        game.load.image('planet10','img/planet10.png');
        game.load.image('planet11','img/planet11.png');
        game.load.image('planet12','img/planet12.png');
        game.load.image('health','img/healthIcon.png');
		game.load.audio('music',['sounds/game_music_v1.mp3','sounds/game_music_v1.ogg']);
        game.load.audio('player_death',['sounds/player_die.mp3','sounds/player_die.ogg']);
        game.load.audio('enemy_death', ['sounds/enemy_die.mp3', 'sounds/enemy_die.ogg']);
        game.load.audio('player_spawn', ['sounds/player_spawn.mp3','sounds/player_spawn.ogg']);
        game.load.audio('game_over', ['sounds/game_over.mp3','sounds/game_over.ogg']);
    }

    function create () {
        // Init space background
        this.nebulaTile = game.add.tileSprite(0, 0, 2000, 2000, 'nebula');
        this.spaceTile = game.add.tileSprite(0, 0, 2000, 2000, 'space');
        for(var i = 0; i < 10; i ++){
        	var sprite = game.add.sprite(game.rnd.integerInRange(0,2000),game.rnd.integerInRange(0,2000),'planet'+game.rnd.integerInRange(1,12));
        	var rand = (game.rnd.realInRange(-2, 2) + game.rnd.realInRange(-2, 6)) / 2 ;
        	sprite.scale.setTo(rand,rand);
        }
        
        // Loop audio
		music = game.add.audio('music',1,true);
		music.play('',0,1,true);
        
        // Store sounds as variables
        playerDeathSound = game.add.audio('player_death');
        enemyDeathSound = game.add.audio('enemy_death');
        spawnSound = game.add.audio('player_spawn');
        gameOverSound = game.add.audio('game_over');
        
        game.world.setBounds(0,0,2000,2000);
		resetSprites();
        
        for(var i = 0; i < lives; i ++){
        	liveSprites[i] = game.add.sprite(game.camera.x + i * 50, game.camera.y + 0,'health');
        	liveSprites[i].fixedToCamera = true;
        }

    }

    function update(){
    	for(var i = 0; i < enemies.length ; i ++){
    		game.physics.arcade.collide(player_sprite,enemies[i],killPlayer,null,this);
    	}

    	for(var i = 0; i < enemies.length; i ++){
    		for(var j =  i + 1; j < enemies.length; j ++){
    			game.physics.arcade.collide(enemies[i],enemies[j],enemyCollide,null,this);
    		}
    	}
    	ai.update();
    	player.update();

        this.spaceTile.tilePosition.x = game.camera.x * .5;
        this.spaceTile.tilePosition.y = game.camera.y * .5;
        this.nebulaTile.tilePosition.x = game.camera.x * .6;
        this.nebulaTile.tilePosition.y = game.camera.y * .6;
    }

    function killPlayer(player,enemy){
    	for(var i = 0; i < enemies.length; i++){
    		enemies[i].destroy();
    	}
    	if (lives > 0) liveSprites[lives - 1].destroy();
    	player_sprite.destroy();
        playerDeathSound.play();
    	lives --;
    	if(lives < 0){
            gameOverSound.play();
    		game.add.text(game.camera.x + game.camera.width / 2,game.camera.y + game.camera.height / 2,"You Lose!", {font: "64px Arial",
        fill: "#ff0044",
        align: "center"});
    	}
    	else{
    		game.time.events.add(Phaser.Timer.SECOND * 4,resetSprites,this);
    	}	
    }

    function resetSprites(){
    	player_sprite = game.add.sprite(game.world.centerX,game.world.centerY,'player');
        player_sprite.animations.add('default', [0, 1, 2, 3], 10, true);
        player_sprite.animations.add('happy', [4, 5, 6], 20, false);
        player_sprite.animations.play('default');
    	player_sprite.anchor.setTo(0.5, 0.5);
        game.physics.enable([player_sprite],Phaser.Physics.ARCADE);
        player_sprite.body.setSize(22, 44, 0, 5);

        if (lives < 3) spawnSound.play();

		player = new Player(game,player_sprite);
		game.camera.follow(player_sprite);
    	ai = new AIController(game,enemies,player,obstacles);
        
        
        
        for(var i = 0; i < 10; i ++){
        	var dispy  = game.rnd.integerInRange(1000,2000);
        	var dispx = game.rnd.integerInRange(1000, 2000);
        	var x = player_sprite.x - dispx  + game.rnd.integerInRange(0,1) * (game.camera.width + dispx) ;
        	var y =  player_sprite.y - dispy + game.rnd.integerInRange(0,1) * (game.camera.height + dispy);
        	

        	enemies[i] = game.add.sprite(x,y,'enemy' );
        	game.physics.enable([enemies[i]],Phaser.Physics.ARCADE);	
        	enemies[i].body.setSize(100,113,0,0);
        }
        
    }

    function enemyCollide(enemy1, enemy2){
        // TODO astronaut talk

        // TODO blood splatter
        
        if(enemy1.inCamera || enemy2.inCamera){
            
            // Play explosion noise if dying enemy is visible
            enemyDeathSound.play();
            
	        // Chance for player animation
	        if (game.rnd.integerInRange(0,1) == 0) {
	            var anim = player_sprite.animations.play('happy');
	            if (anim) {
	                anim.onComplete.add(function(){
	                    player_sprite.animations.play('default');
	                });
	            }

	        }
    	}
        
        

        // Move enemies off screen
    	replaceEnemy(enemy1);
    	replaceEnemy(enemy2);
    }

    function replaceEnemy(enemy){
    	while((enemy.body.x > 0 && enemy.body.x < game.world.width) ||  (enemy.body.y > 0 && enemy.body.y < 600)){
        		var dispy  = game.rnd.integerInRange(1000,2000);
        		var dispx = game.rnd.integerInRange(1000, 2000);
        		var x = player_sprite.x - dispx  + game.rnd.integerInRange(0,1) * (game.camera.width + dispx) ;
        		var y =  player_sprite.y - dispy + game.rnd.integerInRange(0,1) * (game.camera.height + dispy);
        		enemy.body.x = x;
        		enemy.body.y = y;
        } 	
    }


