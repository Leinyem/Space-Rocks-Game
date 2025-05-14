class Player {
  constructor(
    gameScreen,
    left, // Todos los positionLeft los cambio por left y positionTop por top, más claro.
    top,
    playerWidth,
    playerHeight,
    playerImageSrc
  ) {
    this.gameScreen = gameScreen;
    this.left = left;
    this.top = top;

    this.width = playerWidth;
    this.height = playerHeight;
    this.directionX = 0;
    this.directionY = 0;
    this.speed = 1;

    this.projectileType = "normal";
    this.speedTimeout = null;
    this.musicBallTimeout = null;

    this.element = document.createElement("img");
    this.element.src = playerImageSrc;
    this.element.style.position = "absolute";
    this.element.style.top = `${top}px`;
    this.element.style.left = `${left}px`;
    this.element.style.width = `${playerWidth}px`;
    this.element.style.height = `${playerHeight}px`;

    gameScreen.appendChild(this.element);

    this.shootSound = new Audio("./audio/soundWave.wav");
  }

  move() {
    this.left += this.directionX * this.speed;
    this.top += this.directionY * this.speed;

    const gameWidth = this.gameScreen.offsetWidth;
    const gameHeight = this.gameScreen.offsetHeight;

    if (this.left < 0) this.left = 0;
    if (this.left + this.width > gameWidth) this.left = gameWidth - this.width;
    if (this.top < 0) this.top = 0;
    if (this.top + this.height > gameHeight)
      this.top = gameHeight - this.height;

    this.updatePosition();
  }

  updatePosition() {
    this.element.style.top = `${this.top}px`;
    this.element.style.left = `${this.left}px`;
  }

  blink() {
    let count = 0;

    const blinkInterval = setInterval(() => {
      this.element.style.opacity =
        this.element.style.opacity === "0" ? "1" : "0";
      count++;

      if (count === 6) {
        clearInterval(blinkInterval);
        this.element.style.opacity = "1";
      }
    }, 200);
  }

  takeDamage() {
    this.blink();
  }

  shoot() {
    let projectileImage;
    let projectileWidth = 20;
    let projectileHeight = 20;

    if (this.projectileType === "musicBall") {
      projectileImage = "images/musicBall.png";
      projectileWidth = 50;
      projectileHeight = 50;
    } else {
      projectileImage = "images/projectile.png";
    }

    const projectile = new Projectile(
      this.gameScreen,
      this.left + this.width,
      this.top + this.height / 2 - projectileHeight / 2,
      projectileWidth,
      projectileHeight,
      8,
      projectileImage
    );

    this.shootSound.currentTime = 0;
    this.shootSound.play();

    return projectile;
  }

  checkCollision(obstacle) {
    const playerRight = this.left + this.width;
    const playerBottom = this.top + this.height;

    const obstacleRight = obstacle.left + obstacle.width;
    const obstacleBottom = obstacle.top + obstacle.height;

    return !(
      playerRight < obstacle.left ||
      this.left > obstacleRight ||
      playerBottom < obstacle.top ||
      this.top > obstacleBottom
    );
  }
}
