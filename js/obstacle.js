class Obstacle {
  constructor(gameScreen) {
    
    this.left = 1200; 
    this.top = Math.floor(Math.random() * 620); 

    this.width = 90; 
    this.height = 80; 

    this.speed = Math.random() * 2 + 2 

    this.element = document.createElement("img");
    this.element.src = "../images/meteor.png"; 


    this.element.style.position = "absolute";
    this.element.style.top = `${this.top}px`;
    this.element.style.left = `${this.left}px`;
    this.element.style.width = `${this.width}px`;
    this.element.style.height = `${this.height}px`;

    //Add asteroid to game screen
    gameScreen.appendChild(this.element);
  }

  //Move asteroid to the left
  move() {
    this.left -= this.speed;
    this.updatePosition();

    if (this.left + this.width < 0) {
      this.remove();
    }
  }

  // Remove asteroid from DOM
  remove() {
    this.element.remove(); 
  }
  
    
  checkCollision(player) {

    const collMargin = 5

    return (
      this.left + collMargin < player.positionLeft + player.width - collMargin &&
      this.left + this.width - collMargin > player.positionLeft + collMargin &&
      this.top + collMargin < player.positionTop + player.height - collMargin &&
      this.top + this.height - collMargin > player.positionTop + collMargin
    );
  }

  // Updates asteroid position on game screen
  updatePosition() {
    this.element.style.left = `${this.left}px`;
    this.element.style.top = `${this.top}px`;
  }
}

 


  
 