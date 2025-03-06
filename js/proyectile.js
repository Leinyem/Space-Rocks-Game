
class Projectile {

 constructor(gameScreen, left, top) {
  this.gameScreen = gameScreen;
  this.left = left;
  this.top = top;
  this.width = 20; 
  this.height = 20;
  this.speed = 8;

  // create element projectile

  this.element = document.createElement("img");
  this.element.src = "images/projectile.png";
  this.element.style.position = "absolute";
  this.element.style.width = `${this.width}px`;
  this.element.style.height = `${this.height}px`;
  this.element.style.left = `${this.left}px`;
  this.element.style.top = `${this.top}px`;

  this.gameScreen.appendChild(this.element);
}

move() {
  this.left += 5;
  this.updatePosition();
}

updatePosition() {
  this.element.style.left = `${this.left}px`;
}

remove() {

  this.element.remove();

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








    
    
    
    
    
    
    
    
    
    
   