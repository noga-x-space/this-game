const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.6;

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSRC: "./img/background.png",
});

const shop = new Sprite({
  position: {
    x:630,
    y: 128,
  },
  imageSRC: "./img/shop.png",
  scale:2.75,
  framesNumber:6
});

const player = new Fighter({
  position: { x: 0, y: 10 },
  velocity: { x: 0, y: 10 },
  color: "blue",
  offset: {
    x: 0,
    y: 0,
  },
});

const enemy = new Fighter({
  position: { x: 400, y: 100 },
  velocity: { x: 0, y: 10 },
  color: "red",
  offset: {
    x: 50,
    y: 0,
  },
});

const keys = {
  //player keys
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  //enemy keys
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowUp: {
    pressed: false,
  },
};



decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);

  background.update();
  shop.update()

  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  // player movement
  if (keys.a.pressed && player.lastKey === "a" && player.position.x > 0) {
    player.velocity.x = -5;
  } else if (
    keys.d.pressed &&
    player.lastKey === "d" &&
    player.position.x < canvas.width
  ) {
    player.velocity.x = 5;
  } else {
    player.velocity.x = 0;
  }
  // enemy movement
  if (
    keys.ArrowLeft.pressed &&
    enemy.lastKey === "ArrowLeft" &&
    enemy.position.x > 0
  ) {
    enemy.velocity.x = -5;
  } else if (
    keys.ArrowRight.pressed &&
    enemy.lastKey === "ArrowRight" &&
    enemy.position.x < canvas.width
  ) {
    enemy.velocity.x = 5;
  } else {
    enemy.velocity.x = 0;
  }

  //is anyone attacking?
  if (
    player.isAttacking &&
    rectangleCollision({ rect1: player, rect2: enemy })
  ) {
    player.isAttacking = false;
    enemy.health -= 20;
    document.querySelector("#enemyHealth").style.width = enemy.health + "%";
  }
  if (
    enemy.isAttacking &&
    rectangleCollision({ rect1: enemy, rect2: player })
  ) {
    enemy.isAttacking = false;
    player.health -= 20;
    document.querySelector("#playerHealth").style.width = player.health + "%";
  }

  //if a player wins before the timer is 0
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId });
  }
}

animate();

addEventListener("keydown", (event) => {
  switch (event.key) {
    //player keys
    case "d":
      keys.d.pressed = true;
      player.lastKey = "d";
      break;
    case "a":
      keys.a.pressed = true;
      player.lastKey = "a";
      break;
    case "w":
      player.velocity.y = -21;
      break;
    case " ":
      event.preventDefault();
      player.attack();
      break;

    //enemy keys
    case "ArrowRight":
      keys.ArrowRight.pressed = true;
      enemy.lastKey = "ArrowRight";
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = true;
      enemy.lastKey = "ArrowLeft";
      break;
    case "ArrowUp":
      enemy.velocity.y = -21;
      break;
    case "ArrowDown":
      enemy.attack();
  }
});
addEventListener("keyup", (event) => {
  switch (event.key) {
    //player keys
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;

    //enemy keys
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
  }
});
