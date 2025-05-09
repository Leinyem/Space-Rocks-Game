class Projectile {
  constructor(gameScreen, left, top, width, height, speed, imageSrc, type) {
    this.gameScreen = gameScreen;
    this.left = left;
    this.top = top;
    this.width = width || 20;
    this.height = height || 20;
    this.speed = speed || 10;
    this.type = type || "normal"; // Tipo de proyectil: "normal" o "musicBall"

    // Crear elemento del proyectil
    this.element = document.createElement("img");
    this.element.src = imageSrc || "images/projectile.png";
    this.element.style.position = "absolute";
    this.element.style.width = `${this.width}px`;
    this.element.style.height = `${this.height}px`;
    this.element.style.left = `${this.left}px`;
    this.element.style.top = `${this.top}px`;

    this.gameScreen.appendChild(this.element);
  }

  move() {
    this.left += this.speed; // Mover el proyectil hacia la derecha
    this.updatePosition(); // Actualizar la posición visual
  }

  updatePosition() {
    this.element.style.left = `${this.left}px`;
  }

  remove() {
    this.element.remove(); // Eliminar el elemento del DOM
  }

  checkCollision(obstacle) {
    return (
      this.left < obstacle.left + obstacle.width &&
      this.left + this.width > obstacle.left &&
      this.top < obstacle.top + obstacle.height &&
      this.top + this.height > obstacle.top
    );
  }
}
