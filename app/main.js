
	//  The Google WebFont Loader will look for this object, so create it before loading the script.
	WebFontConfig = {

	    //  'active' means all requested fonts have finished loading
	    //  We set a 1 second delay before calling 'createText'.
	    //  For some reason if we don't the browser cannot render the text the first time it's created.
	    active: function() {  },

	    //  The Google Fonts we want to load (specify as many as you like in the array)
	    google: {
	      families: ['Revalia']
	    }

	};

    

    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create ,update : update });
    var enemies = [];
    var player;
    var obstacles = [];
    var ai;
    var player_sprite;
    var lives = 3;
    var music;
    var playerDeathSound;
    var enemyDeathSounds = [];
    var liveSprites = [];
    var laughSprite;
    function preload () {
    	//  Load the Google WebFont Loader script
    	game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
        
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
        game.load.image('l_astronaut','img/laughingAstronaut.png');
		game.load.audio('music',['sounds/game_music_v1.mp3','sounds/game_music_v1.ogg']);
        game.load.audio('player_death',['sounds/player_die.mp3','sounds/player_die.ogg']);
        for (var i = 1; i <= 3; i++) {
            game.load.audio('enemy_death_' + i, ['sounds/enemy_die_' + i + '.mp3', 'sounds/enemy_die_' + i + '.ogg']);
        }
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
        game.world.setBounds(0,0,2000,2000);
		resetSprites();
       

		// Loop audio
		music = game.add.audio('music',1,true);
		music.play('',0,1,true);
        
        // Store sounds as variables
        playerDeathSound = game.add.audio('player_death');
        for (var i = 0; i < 3; i++)
            enemyDeathSounds[i] = game.add.audio('enemy_death_' + i+1);
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
    	if(lives > 0) liveSprites[lives - 1].destroy();
    	player_sprite.destroy();
        playerDeathSound.play();
    	lives --;
    	if(lives < 0){
    		laughSprite = game.add.sprite(0,0,'l_astronaut');
    		laughSprite.fixedToCamera = true;
    		laughSprite.cameraOffset.x = 50;
    		laughSprite.cameraOffset.y = 350
    		createText();
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
        
        enemyDeathSounds[game.rnd.integerInRange(0,2)].play();

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

    var text = null;
	var grd;
    function createText() {

	    text = game.add.text(game.camera.centerX, game.camera.centerY, "You\nLose!");
	    text.anchor.setTo(0.5);
	    text.fixedToCamera = true;
   		text.cameraOffset.x = 400;
    	text.cameraOffset.y = 300;

	    text.font = 'Revalia';
	    text.fontSize = 60;

	    //  x0, y0 - x1, y1
	    grd = text.context.createLinearGradient(0, 0, 0, text.canvas.height);
	    grd.addColorStop(0, '#8ED6FF');   
	    grd.addColorStop(1, '#004CB3');
	    text.fill = grd;

	    text.align = 'center';
	    text.stroke = '#000000';
	    text.strokeThickness = 2;
	    text.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);

	    text.inputEnabled = true;
	    text.input.enableDrag();
	    /*
	    text.events.onInputOver.add(over, this);
	    text.events.onInputOut.add(out, this);
		*/
	}	
	/*
	function out() {

	    text.fill = grd;

	}*/

	

