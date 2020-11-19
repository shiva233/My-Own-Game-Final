var player,playerRun,playerRunFlip

var backgroundIMG,bg

var enemy,enemyIMG,enemyGroup

var cooldown = 0;

var bulletIMG,bulletGroup

var diamond,diamondIMG,diamondGroup

var diamondsLeft = 7;

var score = 0;

var count = 0;

var gameState = "pregame";

var playIMG,playButton

var restartIMG,restartButton;

var shootSound
var explosionSound
var hurtSound

function preload(){

  
  backgroundIMG = loadImage("background.png");

  shootSound = loadSound("Sounds/Shoot.wav");
  hurtSound = loadSound("Sounds/Hurt.wav");
  explosionSound = loadSound("Sounds/Explosion.wav");

  playIMG = loadImage("Animations/Play.png")
  
  restartIMG = loadImage("Animations/Restart.png");

  diamondIMG = loadAnimation("Animations/Diamond/tile000.png","Animations/Diamond/tile001.png",
  "Animations/Diamond/tile002.png","Animations/Diamond/tile003.png","Animations/Diamond/tile004.png","Animations/Diamond/tile005.png",
  "Animations/Diamond/tile006.png","Animations/Diamond/tile007.png")

  playerRun = loadAnimation("Animations/Run/tile000.png","Animations/Run/tile001.png",
  "Animations/Run/tile002.png","Animations/Run/tile003.png","Animations/Run/tile004.png","Animations/Run/tile005.png",
  "Animations/Run/tile006.png","Animations/Run/tile007.png","Animations/Run/tile008.png","Animations/Run/tile009.png","Animations/Run/tile010.png","Animations/Run/tile011.png",)



  enemyIMG = loadImage("Animations/Spiked Ball.png")

  playerRunFlip = loadAnimation("Animations/Run2/tile000.png","Animations/Run2/tile001.png",
  "Animations/Run2/tile002.png","Animations/Run2/tile003.png","Animations/Run2/tile004.png","Animations/Run2/tile005.png",
  "Animations/Run2/tile006.png","Animations/Run2/tile007.png","Animations/Run2/tile008.png","Animations/Run2/tile009.png","Animations/Run2/tile010.png","Animations/Run2/tile011.png",)

  bulletIMG = loadImage("Animations/Bullet.png")

}

function setup() {
  createCanvas(400,800);
  
  bg = createSprite(200,400,20,20);

  bg.addImage(backgroundIMG);

  bg.scale = 15

  playButton = createSprite(200,400,20,20);
  playButton.addImage(playIMG)
  
  restartButton = createSprite(200,500,20,20);
  restartButton.addImage(restartIMG);
  restartButton.visible = false;
  

  player = createSprite(200,600,32,32);

  player.addAnimation("runRight",playerRun);
  player.addAnimation("runLeft",playerRunFlip);

  player.scale = 1.5

  bulletGroup = new Group()

  enemyGroup = new Group()

  diamondGroup = new Group()



  for(var i = 50; i < 400; i = i + 50 ) {

    diamond = createSprite(i,700,18,14);
    diamond.addAnimation("diamonds",diamondIMG);
    // diamond.scale = 2;
    diamondGroup.add(diamond);

  }



 

  

 


  
}

function draw() {
  background(0);

  if(mousePressedOver(playButton)){

    gameState = "play";

  }

  if(gameState === "play"){
    count = count + Math.round(World.frameRate/60);

    playButton.visible = false;

    if(keyDown("d")){
  
  
      player.x = player.x + 5;
  
      player.changeAnimation("runRight",playerRun);
  
  
    }
  
    
    if(keyDown("a")){
  
  
      player.x = player.x - 5;
  
      player.changeAnimation("runLeft",playerRunFlip);
  
  
    }
    
  
  
    if(mouseDown() && cooldown < 0){
  
  
      //shoot the bullet
  
      createBullets();

      shootSound.play();
  
      //console.log("it works :D")
  
      //cooldown
  
  
      cooldown = 30
  
     
  
    }
  
    //This nested for loop goes through both the enemy group (i) and the bullet group (j)
  
    for (var i = 0; i < enemyGroup.length; i++) {
      for(var j = 0; j < bulletGroup.length; j++){
        
        // This checks if the current enemy is touching the current bullet
        if(enemyGroup.get(i).isTouching(bulletGroup.get(j))){
  
          // If it is then destroy both and increase score by 1
  
          score++;
          
          explosionSound.play();

          enemyGroup.get(i).destroy();
  
          bulletGroup.get(j).destroy();
  
        }
        }
  }
  
  
    for (var i = 0; i < diamondGroup.length; i++){
  
      if(diamondGroup.get(i).isTouching(enemyGroup)){
  
  
        diamondGroup.get(i).destroy();
  
        diamondsLeft--
  
        console.log(diamondsLeft);

        hurtSound.play();
  
        
  
  
      }
  
    }
  

  
    cooldown = cooldown - 1;
  
  
  
   
  
    createEnemys();
  
  }

 



  drawSprites();

  if(gameState === "Over"){
    restartButton.visible = true;
    textSize(20);
    fill(0);
    text("YOU LOSE",width/2 - 50,height/2 - 20);

   
    } 

    if(mousePressedOver(restartButton)){

      reset();
    
  
    }


  if(gameState === "pregame"){
    fill(0)
    
    textSize(15);

    text("Use A and D to move left and right",width/2 - 120,height/2 - 20);
    text("You Have 7 lives which can be lost from spikes",width/2 - 150,height/2 - 50);
    text("Click to shoot the spikes",width/2 - 80,height/2 - 80);

  }

  if(diamondsLeft === 0){

    // player.destroy();
    enemyGroup.destroyEach();
    bulletGroup.destroyEach();
    gameState = "Over"

 

  }

  fill(0);
  textSize(30);
  text("Score: " + score,30,50);
  
}

function reset(){

  diamondsLeft = 7;

  player.x = 200;
  player.y = 600;

  score = 0;

  restartButton.visible = false;

  for(var i = 50; i < 400; i = i + 50 ) {

    diamond = createSprite(i,700,18,14);
    diamond.addAnimation("diamonds",diamondIMG);
    // diamond.scale = 2;
    diamondGroup.add(diamond);

  }

  
  count = 0;


  gameState = "play"

}

function createEnemys(){

  if(frameCount % 60 === 0){
    var enemy = createSprite(200,0,32,32);

    enemy.x = Math.round(random(0,400));

    enemy.addImage(enemyIMG);

    enemy.velocityY = (4+ count * 3 / 100);

    enemy.lifetime = 200;

    enemy.scale = 0.7;

    // enemy.debug = true;

    enemy.setCollider("circle",0,0,12)

    

    enemyGroup.add(enemy);




    enemy.depth = player.depth
    player.depth = player.depth + 1;

  }



}

function createBullets(){


  var bullet = createSprite(player.x,600,32,32);

  bullet.velocityY = -7

  bullet.addImage(bulletIMG);

  bullet.depth = player.depth
  player.depth = player.depth + 1;

  bulletGroup.add(bullet);
  

}

