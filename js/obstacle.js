const METEOR_IMAGES = [
  "images/meteor.png",
  "images/meteorBlue.png",
  "images/meteorRed.png",
];

class Obstacle {
  constructor(gameScreen) {
    this.gameScreen = gameScreen;
    this.width = Math.floor(Math.random() * 40) + 60; // entre 60 y 100px
    this.height = this.width;

    this.left = gameScreen.offsetWidth;
    this.top = Math.floor(
      Math.random() * (gameScreen.offsetHeight - this.height)
    );

    // velocidad aleatoria
    this.speed = Math.random() * 2 + 4; // entre 2 y 6

    // velocidad de rotación aleatoria
    this.rotationSpeed = Math.random() * 2 - 1; // entre -1 y 1 grados por frame

    // imagen aleatoria
    const randomImg =
      METEOR_IMAGES[Math.floor(Math.random() * METEOR_IMAGES.length)];
    this.element = document.createElement("img");
    this.element.src = randomImg;

    this.element.style.position = "absolute";
    this.element.style.width = `${this.width}px`;
    this.element.style.height = `${this.height}px`;
    this.element.style.left = `${this.left}px`;
    this.element.style.top = `${this.top}px`;

    // Inicializar rotación
    this.rotationAngle = 0;

    this.gameScreen.appendChild(this.element);

    // Vida del meteorito (más grande = más vida)
    this.health = this.width > 80 ? 2 : 1; // Meteoritos grandes necesitan 2 golpes
  }

  move() {
    this.left -= this.speed;

    // Actualizar rotación
    this.rotationAngle += this.rotationSpeed;
    this.element.style.transform = `rotate(${this.rotationAngle}deg)`;

    this.updatePosition();
  }

  updatePosition() {
    this.element.style.left = `${this.left}px`;
    this.element.style.top = `${this.top}px`;
  }

  remove() {
    this.element.remove();
  }

  takeDamage() {
    this.health -= 1;

    // Cambiar el color temporalmente para indicar daño
    this.element.style.filter = "brightness(0.5) sepia(1) hue-rotate(0deg)";
    setTimeout(() => {
      this.element.style.filter = "none";
    }, 200);

    // Simular una sacudida del meteorito
    const originalLeft = this.left;
    const shakeInterval = setInterval(() => {
      this.left += Math.random() > 0.5 ? 5 : -5;
      this.updatePosition();
    }, 50);

    setTimeout(() => {
      clearInterval(shakeInterval);
      this.left = originalLeft;
      this.updatePosition();
    }, 200);

    // Si la vida del meteorito llega a 0, eliminarlo
    if (this.health <= 0) {
      this.remove();
    }
  }
}
