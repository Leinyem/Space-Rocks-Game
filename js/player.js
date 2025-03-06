
class Player {

  constructor(
    gameScreen,
    positionLeft,
    positionTop,
    playerWidth,
    playerHeight,
    playerImageSrc) {
    
    this.gameScreen = gameScreen; 
    this.positionLeft = positionLeft;
    this.positionTop = positionTop;

    this.width = playerWidth;
    this.height = playerHeight;
    this.directionX = 0;
    this.directionY = 0;

    this.element = document.createElement("img");
    this.element.src = playerImageSrc;
    this.element.style.position = "absolute";
    this.element.style.top = `${positionTop}px`;
    this.element.style.left = `${positionLeft}px`;
    this.element.style.width = `${playerWidth}px`;
    this.element.style.height = `${playerHeight}px`;

    gameScreen.appendChild(this.element);
  }

  move(){
    this.positionLeft += this.directionX;
    this.positionTop += this.directionY;

    // Limitar movimiento dentro de los bordes del juego
    if (this.positionLeft < 0) this.positionLeft = 0;
    if (this.positionLeft + this.width > 1200) this.positionLeft = 1200 - this.width;
    if (this.positionTop < 0) this.positionTop = 0;
    if (this.positionTop + this.height > 625) this.positionTop = 625 - this.height;

    this.updatePosition();
  }

  updatePosition(){
    this.element.style.top = `${this.positionTop}px`;
    this.element.style.left = `${this.positionLeft}px`;
  }

  blink(){

    //console.log("blink-blink" , this.element);
   
  let count = 0;

  const blinkInterval = setInterval(() => {

    this.element.style.visibility = this.element.style.visibility === "hidden" ? "visible" : "hidden";
    count++;

    if (count === 4) {
      clearInterval(blinkInterval);
      this.element.style.visibility = "visible"; // Asegurarse de que quede visible al final
    }
  }, 200);
}


  shoot(){

    const projectile = new Projectile(

      this.gameScreen,
      this.positionLeft + this.width, 
      this.positionTop + this.height / 2 - 20,
      
      8,
      20,
      20
    );

    return projectile

   }

  }
      




    
    

  
    
    
    
    
    
    
    
    
    
    /*didCollide(obstacle) {
      const playerRect = this.element.getBoundingClientRect();
      const obstacleRect = obstacle.element.getBoundingClientRect();
  
      if (
        playerRect.left < obstacleRect.right &&
        playerRect.right > obstacleRect.left &&
        playerRect.top < obstacleRect.bottom &&
        playerRect.bottom > obstacleRect.top
      ) {
        //this plays the horn sound on collision
        // this.horn.play();
        //this is testing the spin class
        this.element.classList.add("spin");
        setTimeout(() => {
          //remove class spin after one second
          this.element.classList.remove("spin");
        }, 750);
        return true;
      } else {
        return false;
      }
    }*/
