class PowerUp {
  constructor(game, gameScreen, type, left, top) {
    if (!gameScreen || !(gameScreen instanceof HTMLElement)) {
      throw new Error("gameScreen no es un elemento válido del DOM");
    }
    this.game = game;
    this.gameScreen = gameScreen;
    this.type = type;
    this.width = 40;
    this.height = 40;
    this.left = left;
    this.top = top;

    this.element = document.createElement("img");
    this.element.src = this.getImageByType();
    this.element.style.position = "absolute";
    this.element.style.width = `${this.width}px`;
    this.element.style.height = `${this.height}px`;
    this.element.style.left = `${this.left}px`;
    this.element.style.top = `${this.top}px`;

    this.gameScreen.appendChild(this.element);

    // Tiempo de vida del power-up (desaparece después de 10 segundos)
    this.lifetime = 10000;
    setTimeout(() => this.remove(), this.lifetime);
  }

  getImageByType() {
    if (this.type === "speed") {
      return "images/claveSpeed.png";
    } else if (this.type === "musicBall") {
      return "images/claveMusicball.png";
    } else {
      console.error("Tipo de PowerUp inválido:", this.type);
      return ""; // Imagen por defecto
    }
  }

  remove() {
    this.element.remove();
    this.game.removePowerUp(this);
  }

  checkCollision(player) {
    return !(
      this.top > player.positionTop + player.height ||
      this.top + this.height < player.positionTop ||
      this.left > player.positionLeft + player.width ||
      this.left + this.width < player.positionLeft
    );
  }
}
