class Player {
  constructor(
    gameScreen,
    left,
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
    this.crystalTimeout = null;

    // Sonidos con precarga
    this.shootSound = new Audio("/audio/soundWave.mp3");
    this.shootSound2 = new Audio("/audio/soundWave2.mp3");
    this.drumShotSound = new Audio("/audio/drum-beat.mp3");
    this.bassShotSound = new Audio("/audio/bass-pulse.mp3");
    this.synthShotSound = new Audio("/audio/synth-wave.mp3");
    this.musicBallSound = new Audio("/audio/soundWave.mp3");
    this._shootToggle = false;

    // Precargar todos los sonidos
    this._preloadAudio("/audio/soundWave.mp3");
    this._preloadAudio("/audio/soundWave2.mp3");
    this._preloadAudio("/audio/drum-beat.mp3");
    this._preloadAudio("/audio/bass-pulse.mp3");
    this._preloadAudio("/audio/synth-wave.mp3");
    this._preloadAudio("/audio/soundWave.mp3"); // Precargarlo

    this.element = document.createElement("img");
    this.element.src = playerImageSrc;
    this.element.style.position = "absolute";
    this.element.style.top = `${top}px`;
    this.element.style.left = `${left}px`;
    this.element.style.width = `${playerWidth}px`;
    this.element.style.height = `${playerHeight}px`;

    gameScreen.appendChild(this.element);
  }

  _preloadAudio(url) {
    const audio = new Audio(url);
    audio.preload = "auto";
    audio.volume = 0;
    audio.play().catch(() => {});
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
    let currentSound;

    switch (this.projectileType) {
      case "musicBall":
        projectileImage = "images/musicBall.png";
        projectileWidth = 30;
        projectileHeight = 30;
        currentSound = this.musicBallSound.cloneNode();
        break;
      case "drum":
        currentSound = this.drumShotSound.cloneNode();
        projectileImage = "images/beat-core.png";
        break;
      case "bass":
        currentSound = this.bassShotSound.cloneNode();
        projectileImage = "images/bass-pulse.png";
        break;
      case "synth":
        currentSound = this.synthShotSound.cloneNode();
        projectileImage = "images/synth-wave.png";
        break;
      default:
        projectileImage = "images/projectile.png";
        currentSound = this._shootToggle
          ? this.shootSound2.cloneNode()
          : this.shootSound.cloneNode();
        this._shootToggle = !this._shootToggle;
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

    currentSound.currentTime = 0;
    currentSound.volume = 0.7;
    currentSound.play();

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
