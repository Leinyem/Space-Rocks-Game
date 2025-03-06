class Game{
  constructor() {
    this.startScreen = document.getElementById("game-intro");
    this.statsContainer = document.getElementById("statsContainer");
    this.gameScreen = document.getElementById("game-screen");
    this.gameOverScreen = document.getElementById("game-end");
    this.scoreElement = document.getElementById("score");
    this.livesElement = document.getElementById("lives");
    this.player = new Player(
      this.gameScreen,
      85,
      400,
      100,
      120,
      "images/astroRocker.png");

    this.height = 650;
    this.width = 1200;
    this.obstacles = [new Obstacle(this.gameScreen)];
    this.projectiles = [];
    this.score = 0;
    this.lives = 3;
    this.gameIsOver = false;
    this.gameIntervalId = null;
    this.gameLoopFrequency = Math.round(1000 / 60);
    this.counter = 0;

  }

  start() {
    this.gameScreen.style.height = `${this.height}px`;
    this.gameScreen.style.width = `${this.width}px`;
    this.startScreen.style.display = "none";
    this.gameScreen.style.display = "block";
    this.gameIntervalId = setInterval(() => this.gameLoop() , this.gameLoopFrequency);
  }

  gameLoop() {
    this.update();
    this.counter++;

    //generate asteroids

    if (this.counter % 160 === 0) {
      this.obstacles.push(new Obstacle(this.gameScreen));  
    }

    //adding projectile movement

    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const projectile = this.projectiles[i];
      projectile.move();

      // remove projectiles outside screen
      if (projectile.left > this.width) {
        projectile.remove();
        this.projectiles.splice(i, 1);

        continue; //jumps to next if theres nothing to remove
      }

      // collision with asteroid

      for (let j = this.obstacles.length - 1; j >= 0; j--) {
        const obstacle = this.obstacles[j];
        if (projectile.checkCollision(obstacle)) {
          projectile.remove();
          obstacle.remove();

          // erase projectile and asteroid

          this.projectiles.splice(i, 1);
          this.obstacles.splice(j, 1);

          // scoring up
          
          this.score++;
          this.scoreElement.innerText = this.score;
          break; // IMPORTANT  exit loop if theres collision
        }
      }
    }

    if (this.gameIsOver) {
      this.endGame();
    }
  }

  update() {
    this.player.move();

    this.obstacles.forEach((obstacle, index) => {
      obstacle.move();

      if (obstacle.checkCollision(this.player)) {  //verify collision

        this.lives--;
        this.livesElement.innerText = this.lives;

        this.player.blink();

        //remove collided asteroid

        obstacle.remove();
        this.obstacles.splice(index, 1);

        if (this.lives <= 0) {
          this.endGame();
        }
      }

      // remove asteroids outside screen

      if (obstacle.left + obstacle.width < 0) {
        obstacle.remove();
        this.obstacles.splice(index, 1);
      }

    });
  }

  endGame(){
    clearInterval(this.gameIntervalId); // Stops game loop
    this.gameIsOver = true;

    this.gameScreen.style.display = "none"; 
    this.gameOverScreen.style.display = "flex"; 
    this.gameOverScreen.style.alignItems = "center";
    this.gameOverScreen.style.justifyContent = "center";
    this.statsContainer.style.display = "none"; 
  }
}
  


      /*;
      
      for (let i = 0; i < this.obstacles.length; i++) {
        const currentObstacle = this.obstacles[i];
        currentObstacle.move();
        
        if (this.player.didCollide(currentObstacle)) {
          
          this.obstacles.splice(i, 1);
          i--;
         
          currentObstacle.element.remove();
          this.lives--;
          this.livesElement.innerText = this.lives;
         
          if (this.lives === 0) {
            this.gameIsOver = true;
          }
        }
  
        //check if the red passes the blue...
        //first we get a point
        //then we cut the red car out of array
        if (currentObstacle.top > 650) {
          this.score++;
          this.scoreElement.innerText = this.score;
          //remove the red car from the array in JS
          this.obstacles.splice(i, 1);
          i--;
          //dont forget to remove the img element from the html
          currentObstacle.element.remove();
        }
  
        //this is where we start with the projectiles
        for (let j = 0; j < this.projectiles.length; j++) {
          const currentProjectile = this.projectiles[j];
          //every projectile has the didCollide method
          if (currentProjectile.didCollide(currentObstacle)) {
            this.obstacles.splice(i, 1);
            i--;
            //dont forget to remove the img element from the html
            currentObstacle.element.remove();
            //remove all of the projectile stuff too
            this.projectiles.splice(j, 1);
            j--;
            currentProjectile.element.remove();
          }
        }
      }
  
      //this is a loop just to move the projectiles
      for (let k = 0; k < this.projectiles.length; k++) {
        const currentProjectile = this.projectiles[k];
        currentProjectile.move();
      }
    }
    gameOver() {
      //stop the loop from running
      clearInterval(this.gameIntervalId);
      //hide the game screen
      this.gameScreen.style.display = "none";
      //show the game over screen
      this.gameOverScreen.style.display = "block";
    }
  }*/