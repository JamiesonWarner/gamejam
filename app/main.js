

    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create ,update : update });
    var enemies = [];
    var player;
    var obstacles = [];
    var ai;
    var player_sprite;
    var lives = 3;
    var livesText;
    function preload () {
        game.load.image('logo', 'phaser.png');
        game.load.image('enemy','img/enemy_test.png');
        game.load.image('player','img/player.png');
        
    }

    function create () {
    	var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');
        logo.anchor.setTo(0.5, 0.5);
        game.world.setBounds(0,0,2000,2000);
		resetSprites();
        livesText = game.add.text(0,0,"Lives: "+ lives,{
        font: "24px Arial",
        fill: "#ff0044",
        align: "center"
    });
        livesText.fixedToCamera = true;
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
    }

    function killPlayer(player,enemy){
    	for(var i = 0; i < enemies.length; i++){
    		enemies[i].destroy();
    	}
    	player_sprite.destroy();
    	lives --;
    	livesText.setText("Lives: "+lives);
    	if(lives == 0){
    		game.add.text(game.world.centerX,game.world.centerY,"You Lose!", {font: "64px Arial",
        fill: "#ff0044",
        align: "center"});
    	}
    	else{
    		game.time.events.add(Phaser.Timer.SECOND * 4,resetSprites,this);
    	}	
    }

    function resetSprites(){
    	player_sprite = game.add.sprite(game.world.centerX,game.world.centerY,'player');
    	player_sprite.anchor.setTo(0.5, 0.5);
        game.physics.enable([player_sprite],Phaser.Physics.ARCADE);
		player = new Player(game,player_sprite);
		game.camera.follow(player_sprite);
    	ai = new AIController(game,enemies,player,obstacles);
        
        
        
        for(var i = 0; i < 10; i ++){
        	var x = 400;
        	var y =  400;
        	while((x > 0 && x < game.camera.width) ||  (y > 0 && y < 600)){
        		x = game.rnd.integerInRange(-800, 1600);
        		y =game.rnd.integerInRange(-600,1200);
        	} 

        	enemies[i] = game.add.sprite(x,y,'enemy' );
        	game.physics.enable([enemies[i]],Phaser.Physics.ARCADE);	
        	enemies[i].body.setSize(97,24,0,12);
        }
    }

    function enemyCollide(enemy1, enemy2){
    	replaceEnemy(enemy1);
    	replaceEnemy(enemy2);
    }

    function replaceEnemy(enemy){
    	while((enemy.body.x > 0 && enemy.body.x < game.world.width) ||  (enemy.body.y > 0 && enemy.body.y < 600)){
        		enemy.body.x = game.rnd.integerInRange(-800, 1600);
        		enemy.body.y =game.rnd.integerInRange(-600,1200);
        } 	
    }


