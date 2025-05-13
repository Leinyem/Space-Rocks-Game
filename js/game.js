class Game {
  constructor() {
    this.startScreen = document.getElementById("game-intro");
    this.gameScreen = document.getElementById("game-screen");
    this.gameEndScreen = document.getElementById("game-end");

    this.player = new Player(
      this.gameScreen,
      200,
      300,
      70,
      95,
      "./images/astroRocker.png"
    );

    this.height = 550;
    this.width = 1200;

    this.obstacles = [];
    this.projectiles = [];
    this.powerUps = []; // Lista de power-ups activos

    this.score = 0;
    this.lives = 10;

    this.gameIsOver = false;

    this.backgroundMusic = new Audio("./audio/mainTheme.wav");
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = 0.5;
  }

  start() {
    this.gameScreen.style.height = `${this.height}px`;
    this.gameScreen.style.width = `${this.width}px`;
    this.startScreen.style.display = "none";
    this.gameScreen.style.display = "block";
    this.backgroundMusic.play();
    this.gameLoop();
  }

  gameLoop() {
    if (this.gameIsOver) {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
      return;
    }

    this.update();

    window.requestAnimationFrame(() => this.gameLoop());
  }

  update() {
    // Mueve el jugador
    this.player.move();

    // Mueve los obstáculos
    this.obstacles.forEach((obstacle) => {
      obstacle.move();

      // Verificar colisión entre el jugador y el obstáculo
      if (this.player.checkCollision(obstacle)) {
        // SOLO DAÑO SI NO HAY ESCUDO
        if (!this.player.isShielded) {
          console.log("💥 Player collided with obstacle!");
          this.player.takeDamage();
          this.handleCollisionWithObstacle(obstacle);
        } else {
          // Si hay escudo, solo eliminar el obstáculo
          obstacle.remove();
          this.obstacles.splice(this.obstacles.indexOf(obstacle), 1);
        }
      }
    });

    // Mueve los proyectiles
    this.projectiles.forEach((projectile) => {
      projectile.move();
    });

    // Generar nuevos meteoritos aleatoriamente
    if (Math.random() > 0.98 && this.obstacles.length < 5) {
      const randomTop = Math.floor(Math.random() * (this.height - 150) + 50);
      const newObstacle = new Obstacle(this.gameScreen, this.width, randomTop);
      this.obstacles.push(newObstacle);
    }

    // CHEQUEO DE COLISIONES ENTRE PROYECTILES Y OBSTÁCULOS
    this.projectiles.forEach((projectile) => {
      this.obstacles.forEach((obstacle, index) => {
        if (projectile.checkCollision(obstacle)) {
          console.log("💥 Collision detected!");
          projectile.remove();

          if (projectile.element.src.includes("musicBall.png")) {
            const obstacleLeft = obstacle.left;
            const obstacleTop = obstacle.top;
            this.createExplosion(
              obstacleLeft,
              obstacleTop,
              obstacle.width,
              obstacle.height,
              "musicBall"
            );
            obstacle.remove();
            this.obstacles.splice(this.obstacles.indexOf(obstacle), 1);

            const points = obstacle.width > 80 ? 30 : 10;
            this.updateScore(points);

            // Generar un power-up o cristal musical con la nueva probabilidad
            if (Math.random() > 0.5) {
              let rand = Math.random();
              let powerUpType;
              if (rand < 0.55) {
                powerUpType = "speed";
              } else if (rand < 0.85) {
                powerUpType = "musicBall";
              } else if (rand < 0.92) {
                powerUpType = "shield";
              } else if (rand < 0.9533) {
                powerUpType = "beatCore";
              } else if (rand < 0.9866) {
                powerUpType = "bassFragment";
              } else {
                powerUpType = "synthCrystal";
              }
              const newPowerUp = new PowerUp(
                this,
                this.gameScreen,
                powerUpType,
                obstacleLeft,
                obstacleTop
              );
              this.powerUps.push(newPowerUp);
            }
          } else {
            obstacle.takeDamage();

            if (obstacle.health <= 0) {
              const obstacleLeft = obstacle.left;
              const obstacleTop = obstacle.top;
              this.createExplosion(
                obstacleLeft,
                obstacleTop,
                obstacle.width,
                obstacle.height
              );
              obstacle.remove();
              this.obstacles.splice(this.obstacles.indexOf(obstacle), 1);

              const points = obstacle.width > 80 ? 30 : 10;
              this.updateScore(points);

              // Generar un power-up o cristal musical con la nueva probabilidad
              if (Math.random() > 0.5) {
                let rand = Math.random();
                let powerUpType;
                if (rand < 0.55) {
                  powerUpType = "speed";
                } else if (rand < 0.85) {
                  powerUpType = "musicBall";
                } else if (rand < 0.92) {
                  powerUpType = "shield";
                } else if (rand < 0.9533) {
                  powerUpType = "beatCore";
                } else if (rand < 0.9866) {
                  powerUpType = "bassFragment";
                } else {
                  powerUpType = "synthCrystal";
                }
                const newPowerUp = new PowerUp(
                  this,
                  this.gameScreen,
                  powerUpType,
                  obstacleLeft,
                  obstacleTop
                );
                this.powerUps.push(newPowerUp);
              }
            }
          }
        }
      });
    });

    // Mueve los power-ups
    this.powerUps.forEach((powerUp) => {
      powerUp.move();
    });

    // Detectar colisiones entre el jugador y los power-ups y limpiar eliminados
    this.powerUps = this.powerUps.filter((powerUp) => {
      if (powerUp._removed) return false;
      if (powerUp.checkCollision(this.player)) {
        this.applyPowerUp(powerUp.type);
        powerUp.remove();
        return false;
      }
      return true;
    });

    // Limpiar obstáculos fuera de la pantalla
    this.obstacles = this.obstacles.filter((obstacle) => {
      const obstacleRight = obstacle.left + obstacle.width;
      if (obstacleRight < 0) {
        obstacle.element.remove();
        return false;
      } else {
        return true;
      }
    });

    // Limpiar proyectiles fuera de la pantalla
    this.projectiles = this.projectiles.filter((projectile) => {
      const projectileRight = projectile.left + projectile.width;
      if (projectile._removed) return false;
      if (projectileRight > this.width) {
        projectile.remove();
        return false;
      }
      return true;
    });
  }

  createExplosion(left, top, width, height, type = "normal") {
    const explosion = document.createElement("div");
    explosion.style.position = "absolute";
    explosion.style.left = `${left}px`;
    explosion.style.top = `${top}px`;

    if (type === "musicBall") {
      const explosionWidth = Math.max(width, 100);
      const explosionHeight = Math.max(height, 100);

      explosion.style.width = `${explosionWidth}px`;
      explosion.style.height = `${explosionHeight}px`;

      let frame = 1;
      const totalFrames = 10;
      const interval = 50;

      const animationInterval = setInterval(() => {
        explosion.style.backgroundImage = `url('images/Explosion_6/Explosion_${frame}.png')`;
        explosion.style.backgroundSize = "cover";
        explosion.style.backgroundRepeat = "no-repeat";
        frame++;

        if (frame > totalFrames) {
          clearInterval(animationInterval);
          explosion.remove();
        }
      }, interval);
    } else {
      explosion.style.width = `${width}px`;
      explosion.style.height = `${height}px`;
      explosion.style.backgroundImage = "url('images/explosion-sheet.png')";
      explosion.style.backgroundSize = `${7 * width}px ${height}px`;
      explosion.style.backgroundRepeat = "no-repeat";
      explosion.style.backgroundPosition = "0 0";
      explosion.style.animation = `explosion-animation 0.5s steps(7) forwards`;
      explosion.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";
      explosion.style.clipPath = "circle(50% at 50% 50%)";

      setTimeout(() => {
        explosion.remove();
      }, 500);
    }

    this.gameScreen.appendChild(explosion);
  }

  handleCollisionWithObstacle(obstacle) {
    this.lives -= 1;
    console.log(`Lives remaining: ${this.lives}`);

    const livesElement = document.getElementById("lives");
    if (livesElement) {
      livesElement.textContent = this.lives;
    }

    obstacle.remove();
    this.obstacles.splice(this.obstacles.indexOf(obstacle), 1);

    if (this.lives <= 0) {
      this.endGame();
    }
  }

  endGame() {
    console.log("Game Over!");
    this.gameIsOver = true;
    this.gameScreen.style.display = "none";
    this.gameEndScreen.style.display = "block";
  }

  applyPowerUp(type) {
    const playerEl = this.player.element;
    if (!this.player._powerUpStates) {
      this.player._powerUpStates = {
        speed: false,
        musicBall: false,
        shield: false,
      };
    }

    if (type === "speed") {
      this.player._powerUpStates.speed = true;
      if (this.player.speedTimeout) {
        clearTimeout(this.player.speedTimeout);
      } else {
        this.player.speed *= 4;
      }
      this.updatePlayerHalo();
      this.player.speedTimeout = setTimeout(() => {
        this.player.speed /= 4;
        this.player.speedTimeout = null;
        this.player._powerUpStates.speed = false;
        this.updatePlayerHalo();
      }, 5000);
    } else if (type === "musicBall") {
      this.player._powerUpStates.musicBall = true;
      if (this.player.musicBallTimeout) {
        clearTimeout(this.player.musicBallTimeout);
      }
      this.player.projectileType = "musicBall";
      this.updatePlayerHalo();
      this.player.musicBallTimeout = setTimeout(() => {
        this.player.projectileType = "normal";
        this.player.musicBallTimeout = null;
        this.player._powerUpStates.musicBall = false;
        this.updatePlayerHalo();
      }, 10000);
    } else if (type === "shield") {
      this.player._powerUpStates.shield = true;
      this.player.isShielded = true;
      this.updatePlayerHalo();
      if (this.player.shieldTimeout) {
        clearTimeout(this.player.shieldTimeout);
      }
      this.player.shieldTimeout = setTimeout(() => {
        this.player.isShielded = false;
        this.player.shieldTimeout = null;
        this.player._powerUpStates.shield = false;
        this.updatePlayerHalo();
      }, 10000);
    }
  }

  updatePlayerHalo() {
    const playerEl = this.player.element;
    const states = this.player._powerUpStates;

    playerEl.classList.remove(
      "player-neon-blue",
      "player-neon-red",
      "player-neon-purple",
      "player-neon-gold"
    );

    if (states.shield) {
      playerEl.classList.add("player-neon-gold");
    } else if (states.speed && states.musicBall) {
      playerEl.classList.add("player-neon-purple");
    } else if (states.speed) {
      playerEl.classList.add("player-neon-blue");
    } else if (states.musicBall) {
      playerEl.classList.add("player-neon-red");
    }
  }

  updateScore(points) {
    this.score += points;
    document.getElementById("score").textContent = this.score;
  }
}
