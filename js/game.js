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
    this.backgroundMusic.play(); // Reproducir música de fondo
    this.gameLoop();
  }

  gameLoop() {
    if (this.gameIsOver) {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0; // Reiniciar la música
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
        console.log("💥 Player collided with obstacle!");
        this.player.takeDamage(); // Llama al método para que el jugador parpadee
        this.handleCollisionWithObstacle(obstacle);
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
          this.projectiles.splice(this.projectiles.indexOf(projectile), 1);

          // Si es musicBall, destruir el meteorito directamente
          if (projectile.element.src.includes("musicBall.png")) {
            const obstacleLeft = obstacle.left;
            const obstacleTop = obstacle.top;
            this.createExplosion(
              obstacleLeft,
              obstacleTop,
              obstacle.width,
              obstacle.height,
              "musicBall" // Indicar que es una explosión de musicBall
            );
            obstacle.remove();
            this.obstacles.splice(this.obstacles.indexOf(obstacle), 1);

            // Incrementar el puntaje
            const points = obstacle.width > 80 ? 30 : 10;
            this.updateScore(points);

            // Generar un power-up con cierta probabilidad
            if (Math.random() > 0.5) {
              const powerUpType = Math.random() < 0.7 ? "speed" : "musicBall"; // 70% speed, 30% musicBall
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
            // Reducir la vida del meteorito para proyectiles normales
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

              // Incrementar el puntaje
              const points = obstacle.width > 80 ? 30 : 10;
              this.updateScore(points);

              // Generar un power-up con cierta probabilidad
              if (Math.random() > 0.5) {
                const powerUpType = Math.random() < 0.7 ? "speed" : "musicBall"; // 70% speed, 30% musicBall
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

    // Detectar colisiones entre el jugador y los power-ups
    this.powerUps = this.powerUps.filter((powerUp) => {
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
      if (projectileRight > this.width) {
        projectile.element.remove();
        return false;
      } else {
        return true;
      }
    });
  }

  createExplosion(left, top, width, height, type = "normal") {
    const explosion = document.createElement("div");
    explosion.style.position = "absolute";
    explosion.style.left = `${left}px`;
    explosion.style.top = `${top}px`;

    if (type === "musicBall") {
      // Hacer la explosión al menos tan grande como el meteorito
      const explosionWidth = Math.max(width, 100); // Asegurar un tamaño mínimo de 100px
      const explosionHeight = Math.max(height, 100); // Asegurar un tamaño mínimo de 100px

      explosion.style.width = `${explosionWidth}px`;
      explosion.style.height = `${explosionHeight}px`;

      let frame = 1;
      const totalFrames = 10; // Número total de frames
      const interval = 50; // Tiempo entre frames en milisegundos

      const animationInterval = setInterval(() => {
        explosion.style.backgroundImage = `url('images/Explosion_6/Explosion_${frame}.png')`;
        explosion.style.backgroundSize = "cover"; // Ajustar al tamaño del div
        explosion.style.backgroundRepeat = "no-repeat";
        frame++;

        if (frame > totalFrames) {
          clearInterval(animationInterval); // Detener la animación
          explosion.remove(); // Eliminar el div después de la animación
        }
      }, interval);
    } else {
      // Usar el estilo normal para otras explosiones
      explosion.style.width = `${width}px`;
      explosion.style.height = `${height}px`;
      explosion.style.backgroundImage = "url('images/explosion-sheet.png')";
      explosion.style.backgroundSize = `${7 * width}px ${height}px`; // Ajustar tamaño del fondo
      explosion.style.backgroundRepeat = "no-repeat";
      explosion.style.backgroundPosition = "0 0";
      explosion.style.animation = `explosion-animation 0.5s steps(7) forwards`;
      explosion.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)"; // Sombra difuminada
      explosion.style.clipPath = "circle(50% at 50% 50%)"; // Forma circular

      setTimeout(() => {
        explosion.remove(); // Eliminar el div después de la animación
      }, 500); // Duración de la animación
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
    if (type === "speed") {
      console.log("Power-Up: Velocidad activada!");
      if (this.player.speedTimeout) {
        clearTimeout(this.player.speedTimeout); // Reinicia el temporizador
      } else {
        this.player.speed *= 4; // Aumenta la velocidad
      }

      this.player.speedTimeout = setTimeout(() => {
        this.player.speed /= 4; // Restaura la velocidad original
        this.player.speedTimeout = null; // Limpia el temporizador
        console.log("Power-Up: Velocidad terminada.");
      }, 5000);
    } else if (type === "musicBall") {
      console.log("Power-Up: MusicBall activado!");
      if (this.player.musicBallTimeout) {
        clearTimeout(this.player.musicBallTimeout); // Reinicia el temporizador
      }
      this.player.projectileType = "musicBall";

      this.player.musicBallTimeout = setTimeout(() => {
        this.player.projectileType = "normal";
        this.player.musicBallTimeout = null; // Limpia el temporizador
        console.log("Power-Down: MusicBall terminado.");
      }, 10000);
    }
  }

  updateScore(points) {
    this.score += points;
    document.getElementById("score").textContent = this.score;
  }

  removePowerUp(powerUp) {
    const index = this.powerUps.indexOf(powerUp);
    if (index > -1) {
      this.powerUps.splice(index, 1);
    }
  }
}
