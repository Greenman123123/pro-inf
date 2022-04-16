var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2;

var score = 0;

var gameOver, restart;


function preload() {
  trex_running = loadAnimation("boy1.png", "boy2.png", "boy3.png", "boy4.png", "boy5.png");
  trex_collided = loadAnimation("dead.png");

  groundImage = loadImage("bg.png");

  cloudImage = loadImage("birds.png");

  obstacle1 = loadImage("obstacle.png");
  obstacle2 = loadImage("obstacle22.png");


  gameOverImg = loadImage("gameover1.png");
  restartImg = loadImage("reset.png");
}

function setup() {
  createCanvas(600, 400);

  ground = createSprite(width / 2, height / 2, 600, 400);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;
  ground.velocityX = -(3);

  trex = createSprite(50, height - 50, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 1;

  // trex.debug = true
  trex.setCollider("rectangle", 0, 0, trex.width - 100, trex.height - 100)

  gameOver = createSprite(300, 100);
  gameOver.addImage(gameOverImg);

  restart = createSprite(300, 160);
  restart.addImage(restartImg);

  gameOver.scale = 0.8;
  restart.scale = 0.4;

  gameOver.visible = false;
  restart.visible = false;

  invisibleGround = createSprite(200, height - 20, 400, 10);
  invisibleGround.visible = false;

  cloudsGroup = new Group();
  obstaclesGroup = new Group();

  score = 0;
}

function draw() {
  //trex.debug = true;
  background("blue");
  text("Score: " + score, 500, 50);

  if (gameState === PLAY) {
    score = score + Math.round(getFrameRate() / 60);
    ground.velocityX = -3;
    //change the trex animation
    trex.changeAnimation("running", trex_running);

    if (keyDown("space") && trex.y >= 159) {
      trex.velocityY = -12;
    }

    trex.velocityY = trex.velocityY + 0.8

    if (ground.x < 100) {
      ground.x = ground.width / 2;
    }

    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();

    if (obstaclesGroup.isTouching(trex)) {
      gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;

    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);

    //change the trex animation
    trex.changeAnimation("collided", trex_collided);

    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);

    if (mousePressedOver(restart)) {
      reset();
    }
  }


  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 150 === 0) {
    var cloud = createSprite(600, 120, 40, 10);
    cloud.y = Math.round(random(80, 120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;

    //assign lifetime to the variable
    cloud.lifetime = 200;

    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    //add each cloud to the group
    cloudsGroup.add(cloud);
  }

}

function reset() {
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;

  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  score = 0;
}

function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(width, height - 50, 10, 40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3 * score / 100);
    obstacle.debug = true


    //generate random obstacles
    var rand = Math.round(random(1, 2));
    switch (rand) {
      case 1: obstacle.addImage(obstacle1);
        obstacle.setCollider("rectangle", 0, 0, 50, 50)
        break;
      case 2: obstacle.addImage(obstacle2);
        obstacle.setCollider("rectangle", 0, 0, 50, 50)
        break;
      default: break;
    }

    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}