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
    this.powerUps = [];

    this.score = 0;
    this.lives = 10;
    this.gameIsOver = false;

    this.highscore = localStorage.getItem("highscore") || 0;
    document.getElementById("highscore").textContent = this.highscore;

    // NUEVO: Contadores de cristales por tipo
    this.crystalCounts = {
      beatCore: 0,
      bassFragment: 0,
      synthCrystal: 0,
    };
    this.crystalsUnlocked = {
      beatCore: false,
      bassFragment: false,
      synthCrystal: false,
    };

    // NUEVO: Loop de batería
    this.drumLoop = new Audio("./audio/drumLoop.mp3");
    this.drumLoop.loop = true;
    this.drumLoop.volume = 0.7;
    this.drumLoopActive = false;
  }

  start() {
    this.gameScreen.style.height = `${this.height}px`;
    this.gameScreen.style.width = `${this.width}px`;
    this.startScreen.style.display = "none";
    this.gameScreen.style.display = "block";
    // QUITADO: this.backgroundMusic.play();
    this.gameLoop();
  }

  gameLoop() {
    if (this.gameIsOver) {
      // Si quieres pausar el loop de batería al terminar el juego:
      if (this.drumLoopActive) {
        this.drumLoop.pause();
        this.drumLoopActive = false;
      }
      return;
    }

    this.update();

    window.requestAnimationFrame(() => this.gameLoop());
  }

  update() {
    this.player.move();

    // Mueve los obstáculos
    this.obstacles.forEach((obstacle) => {
      obstacle.move();

      // Verificar colisión entre el jugador y el obstáculo
      if (this.player.checkCollision(obstacle)) {
        if (!this.player.isShielded) {
          this.player.takeDamage();
          this.handleCollisionWithObstacle(obstacle);
        } else {
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
    this.gameIsOver = true;
    this.gameScreen.style.display = "none";
    document.getElementById("game-container").style.display = "none";

    this.gameEndScreen.style.display = "block";
    if (this.score > this.highscore) {
      localStorage.setItem("highscore", this.score);
    }
    if (this.startScreen) {
      this.startScreen.style.display = "none";
    }
    // NUEVO: Pausa el loop de batería si está activo
    if (this.drumLoopActive) {
      this.drumLoop.pause();
      this.drumLoopActive = false;
    }
  }

  applyPowerUp(type) {
    // Power-ups clásicos...
    if (type === "speed") {
      this.player._powerUpStates = this.player._powerUpStates || {};
      this.player._powerUpStates.speed = true;
      if (this.player.speedTimeout) {
        clearTimeout(this.player.speedTimeout);
      } else {
        this.player.speed *= 4;
      }
      this.updatePlayerHalo && this.updatePlayerHalo();
      this.player.speedTimeout = setTimeout(() => {
        this.player.speed /= 4;
        this.player.speedTimeout = null;
        this.player._powerUpStates.speed = false;
        this.updatePlayerHalo && this.updatePlayerHalo();
      }, 5000);
    } else if (type === "musicBall") {
      this.player._powerUpStates = this.player._powerUpStates || {};
      this.player._powerUpStates.musicBall = true;
      if (this.player.musicBallTimeout) {
        clearTimeout(this.player.musicBallTimeout);
      }
      this.player.projectileType = "musicBall";
      this.updatePlayerHalo && this.updatePlayerHalo();
      this.player.musicBallTimeout = setTimeout(() => {
        this.player.projectileType = "normal";
        this.player.musicBallTimeout = null;
        this.player._powerUpStates.musicBall = false;
        this.updatePlayerHalo && this.updatePlayerHalo();
      }, 10000);
    } else if (type === "shield") {
      this.player._powerUpStates = this.player._powerUpStates || {};
      this.player._powerUpStates.shield = true;
      this.player.isShielded = true;
      this.updatePlayerHalo && this.updatePlayerHalo();
      if (this.player.shieldTimeout) {
        clearTimeout(this.player.shieldTimeout);
      }
      this.player.shieldTimeout = setTimeout(() => {
        this.player.isShielded = false;
        this.player.shieldTimeout = null;
        this.player._powerUpStates.shield = false;
        this.updatePlayerHalo && this.updatePlayerHalo();
      }, 10000);
    }

    // NUEVO: Cristales musicales
    if (
      type === "beatCore" ||
      type === "bassFragment" ||
      type === "synthCrystal"
    ) {
      this.crystalCounts[type]++;
      if (!this.crystalsUnlocked[type] && this.crystalCounts[type] >= 10) {
        this.crystalsUnlocked[type] = true;
        this.updateCrystalsUnlockedHUD();
        // Aquí puedes poner un sonido de desbloqueo si quieres
      } else {
        this.updateCrystalsUnlockedHUD();
      }
      return;
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

    if (states && states.shield) {
      playerEl.classList.add("player-neon-gold");
    } else if (states && states.speed && states.musicBall) {
      playerEl.classList.add("player-neon-purple");
    } else if (states && states.speed) {
      playerEl.classList.add("player-neon-blue");
    } else if (states && states.musicBall) {
      playerEl.classList.add("player-neon-red");
    }
  }

  updateScore(points) {
    this.score += points;
    document.getElementById("score").textContent = this.score;

    if (this.score > this.highscore) {
      this.highscore = this.score;
      localStorage.setItem("highscore", this.highscore);
      document.getElementById("highscore").textContent = this.highscore;
    }
  }

  // NUEVO: Método para actualizar el HUD de cristales desbloqueados
  updateCrystalsUnlockedHUD() {
    const container = document.getElementById("crystals-unlocked");
    if (!container) return;
    container.innerHTML = ""; // Limpia

    if (this.crystalsUnlocked.beatCore) {
      const el = document.createElement("img");
      el.src = "images/beatCore.png";
      el.alt = "Batería desbloqueada";
      el.title = "Q: Activar/Desactivar batería";
      el.style.width = "40px";
      el.style.height = "40px";
      container.appendChild(el);
    }
    if (this.crystalsUnlocked.bassFragment) {
      const el = document.createElement("img");
      el.src = "images/bassShard.png";
      el.alt = "Bajo desbloqueado";
      el.title = "W: Activar/Desactivar bajo";
      el.style.width = "40px";
      el.style.height = "40px";
      container.appendChild(el);
    }
    if (this.crystalsUnlocked.synthCrystal) {
      const el = document.createElement("img");
      el.src = "images/synthCrystal.png";
      el.alt = "Synth desbloqueado";
      el.title = "E: Activar/Desactivar synth";
      el.style.width = "40px";
      el.style.height = "40px";
      container.appendChild(el);
    }
  }

  // NUEVO: Métodos para activar/desactivar loops
  activateDrumLoop() {
    if (!this.crystalsUnlocked.beatCore) return;
    if (!this.drumLoopActive) {
      this.drumLoop.currentTime = 0;
      this.drumLoop.play();
      this.drumLoopActive = true;
    } else {
      this.drumLoop.pause();
      this.drumLoopActive = false;
    }
  }
}
