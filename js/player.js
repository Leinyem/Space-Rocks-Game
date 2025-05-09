class Player {
  constructor(
    gameScreen,
    positionLeft,
    positionTop,
    playerWidth,
    playerHeight,
    playerImageSrc
  ) {
    this.gameScreen = gameScreen;
    this.positionLeft = positionLeft;
    this.positionTop = positionTop;

    this.width = playerWidth;
    this.height = playerHeight;
    this.directionX = 0;
    this.directionY = 0;
    this.speed = 1; // Velocidad base del jugador

    this.projectileType = "normal";
    this.speedTimeout = null; // Temporizador para el power-up de velocidad
    this.musicBallTimeout = null; // Temporizador para el power-up de musicBall

    this.element = document.createElement("img");
    this.element.src = playerImageSrc;
    this.element.style.position = "absolute";
    this.element.style.top = `${positionTop}px`;
    this.element.style.left = `${positionLeft}px`;
    this.element.style.width = `${playerWidth}px`;
    this.element.style.height = `${playerHeight}px`;

    gameScreen.appendChild(this.element);

    this.shootSound = new Audio("./audio/soundWave.wav");
  }

  move() {
    this.positionLeft += this.directionX * (this.speed || 1); // Multiplica por la velocidad
    this.positionTop += this.directionY * (this.speed || 1); // Multiplica por la velocidad

    // Obtener las dimensiones dinámicas del área de juego
    const gameWidth = this.gameScreen.offsetWidth;
    const gameHeight = this.gameScreen.offsetHeight;

    // Limitar movimiento dentro de los bordes del juego
    if (this.positionLeft < 0) this.positionLeft = 0;
    if (this.positionLeft + this.width > gameWidth)
      this.positionLeft = gameWidth - this.width;
    if (this.positionTop < 0) this.positionTop = 0;
    if (this.positionTop + this.height > gameHeight)
      this.positionTop = gameHeight - this.height;

    this.updatePosition();
  }

  updatePosition() {
    this.element.style.top = `${this.positionTop}px`;
    this.element.style.left = `${this.positionLeft}px`;
  }

  blink() {
    let count = 0;

    const blinkInterval = setInterval(() => {
      //onsole.log(`Blinking... Count: ${count}`); // Depuración

      this.element.style.opacity =
        this.element.style.opacity === "0" ? "1" : "0"; // Alternar entre visible e invisible
      count++;

      if (count === 6) {
        clearInterval(blinkInterval);
        this.element.style.opacity = "1"; // Asegurarse de que quede visible al final
      }
    }, 200);
  }

  takeDamage() {
    // Animación de daño: parpadeo
    this.blink();

    // Aquí puedes añadir más lógica si es necesario (por ejemplo, reducir vidas)
  }

  shoot() {
    let projectileImage;
    let projectileWidth = 20; // Tamaño por defecto
    let projectileHeight = 20; // Tamaño por defecto

    if (this.projectileType === "musicBall") {
      projectileImage = "images/musicBall.png"; // Imagen para el disparo especial
      projectileWidth = 50; // Ancho más grande para musicBall
      projectileHeight = 50; // Alto más grande para musicBall
    } else {
      projectileImage = "images/projectile.png"; // Imagen para el disparo normal
    }

    const projectile = new Projectile(
      this.gameScreen,
      this.positionLeft + this.width,
      this.positionTop + this.height / 2 - projectileHeight / 2,
      projectileWidth, // Ancho del proyectil
      projectileHeight, // Alto del proyectil
      8, // Velocidad del proyectil
      projectileImage // Imagen personalizada
    );

    this.shootSound.currentTime = 0; // Reinicia el sonido si ya se está reproduciendo
    this.shootSound.play();

    return projectile;
  }

  checkCollision(obstacle) {
    const collision = !(
      this.positionTop > obstacle.top + obstacle.height ||
      this.positionTop + this.height < obstacle.top ||
      this.positionLeft > obstacle.left + obstacle.width ||
      this.positionLeft + this.width < obstacle.left
    );

    return collision;
  }
}
