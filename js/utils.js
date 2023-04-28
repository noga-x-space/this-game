//this function checks if there's collision between two "attack" rectangle
function rectangleCollision({ rect1, rect2 }) {
  return (
    player.attackbox.position.x + player.attackbox.width >= enemy.position.x &&
    player.attackbox.position.x <= enemy.position.x + enemy.width &&
    player.attackbox.height + player.attackbox.position.y >= enemy.position.y &&
    player.attackbox.position.y <= enemy.position.y + enemy.height
  );
}

function determineWinner({ player, enemy, timerId }) {
  clearTimeout(timerId);
  let displayText = document.querySelector("#displayText");
  displayText.style.display = "flex";

  if (player.health === enemy.health) {
    displayText.innerHTML = "tie";
  } else if (player.health > enemy.health) {
    displayText.innerHTML = "Player 1 wins";
  } else {
    displayText.innerHTML = "Player 2 wins";
  }
}

let timer = 60;
let timerId;

function decreaseTimer() {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000);
    timer--;
    document.querySelector("#timer").innerHTML = timer;
  }
  if (timer === 0) {
    determineWinner({ player, enemy, timerId });
  }
}
