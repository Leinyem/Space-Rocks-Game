
let ourNewGame = null;

window.onload = function () {
  const startButtonElement = document.getElementById("start-button");
  const restartButtonElement = document.getElementById("restart-button");

  const statsContainer = document.getElementById("statsContainer");
  statsContainer.style.display = "none";   //hide stats main screen

  function startNewGame() {
    
    if (ourNewGame) {
      ourNewGame = null; 
    }
     
   /* //dont forget to ADD MUSIC and PAUSE it when START

    const introMusic = document.getElementById("introMusic");
    
    if(introMusic){

      introMusic.volume = 1;
      introMusic.play
 }
     
     if(introMusic) introMusic.pause()*/


    ourNewGame = new Game();
    ourNewGame.start();

    statsContainer.style.display = "block";

  }

  
  startButtonElement.addEventListener("click", function () {
    startNewGame();
  });

  
  restartButtonElement.addEventListener("click", function () {
    
    location.reload()
  
  });

   

//keyboard event listeners
window.addEventListener("keydown", (event) => {
  if (!ourNewGame) return;
  if (event.code === "ArrowUp") ourNewGame.player.directionY = -5;
  if (event.code === "ArrowDown") ourNewGame.player.directionY = 5;   //Player
  if (event.code === "ArrowLeft") ourNewGame.player.directionX = -5;
  if (event.code === "ArrowRight") ourNewGame.player.directionX = 5;

  if (event.code === "Space" && ourNewGame) {
    const projectile = ourNewGame.player.shoot(); // Projectile
    ourNewGame.projectiles.push(projectile);
  }
});


window.addEventListener("keyup", (event) => {
  if (!ourNewGame) return;
  if (["ArrowUp", "ArrowDown"].includes(event.code)) ourNewGame.player.directionY = 0;
  if (["ArrowLeft", "ArrowRight"].includes(event.code)) ourNewGame.player.directionX = 0;
});

  
}     