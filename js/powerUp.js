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
    this.element.classList.add("power-up");

    this.gameScreen.appendChild(this.element);

    // Tiempo de vida del power-up
    this.lifetime = 10000;
    setTimeout(() => this.remove(), this.lifetime);

    this._removed = false; // Flag para saber si ya fue eliminado! Puede dar error si se intenta eliminar dos veces: se para en el aire o no se reconoce.
  }

  getImageByType() {
    if (this.type === "speed") {
      return "images/claveSpeed.png";
    } else if (this.type === "musicBall") {
      return "images/claveMusicball.png";
    } else if (this.type === "shield") {
      return "images/claveSolDorada.png";
    } else if (this.type === "beatCore") {
      return "images/beatCore.png";
    } else if (this.type === "bassFragment") {
      return "images/bassShard.png";
    } else if (this.type === "synthCrystal") {
      return "images/synthCrystal.png";
    } else {
      console.error("Tipo de PowerUp inválido:", this.type);
      return "";
    }
  }

  move() {
    this.left -= 2;
    this.element.style.left = `${this.left}px`;
  }

  remove() {
    if (this.element.parentNode) {
      this.element.remove();
    }
    this._removed = true;
  }

  checkCollision(player) {
    const playerRight = player.left + player.width;
    const playerBottom = player.top + player.height;

    const powerUpRight = this.left + this.width;
    const powerUpBottom = this.top + this.height;

    return !(
      playerBottom < this.top ||
      player.top > powerUpBottom ||
      playerRight < this.left ||
      player.left > powerUpRight
    );
  }
}
