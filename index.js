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
    x: 630,
    y: 128,
  },
  imageSRC: "./img/shop.png",
  scale: 2.75,
  framesNumber: 6,
});

const player = new Fighter({
  position: { x: 0, y: 10 },
  velocity: { x: 0, y: 10 },
  color: "blue",
  offset: {
    x: 0,
    y: 0,
  },
  imageSRC: "./img/samuraiMack/Idle.png",
  framesNumber: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 157,
  },
  sprites: {
    idle: {
      imageSrc: "./img/samuraiMack/Idle.png",
      framesNumber: 8,
    },
    run: {
      imageSrc: "./img/samuraiMack/Run.png",
      framesNumber: 8,
    },
    jump: {
      imageSrc: "./img/samuraiMack/Jump.png",
      framesNumber: 2,
    },
    attack1: {
      imageSrc: "./img/samuraiMack/Attack1.png",
      framesNumber: 6,
    },
    fall: {
      imageSrc: "./img/samuraiMack/Fall.png",
      framesNumber: 2,
    },
    takeHit:{
        imageSrc: "./img/samuraiMack/Take Hit - white silhouette.png",
        framesNumber: 4,
    }
  },
  attackbox: {
    offset: { x: 100, y: 50 },
    width: 157,
    height: 50,
  },
});

const enemy = new Fighter({
  position: { x: 400, y: 100 },
  velocity: { x: 0, y: 0 },
  color: "red",
  offset: {
    x: 50,
    y: 0,
  },
  imageSRC: "./img/kenji/Idle.png",
  framesNumber: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 167,
  },
  sprites: {
    idle: {
      imageSrc: "./img/kenji/Idle.png",
      framesNumber: 4,
    },
    run: {
      imageSrc: "./img/kenji/Run.png",
      framesNumber: 8,
    },
    jump: {
      imageSrc: "./img/kenji/Jump.png",
      framesNumber: 2,
    },
    fall: {
      imageSrc: "./img/kenji/Fall.png",
      framesNumber: 2,
    },
    attack1: {
      imageSrc: "./img/kenji/Attack1.png",
      framesNumber: 4,
    },
    takeHit:{
        imageSrc: "./img/kenji/Take hit.png",
        framesNumber: 4,
    }
  },
  attackbox: {
    offset: { x: -170, y: +50 },
    width: 157,
    height: 50,
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
  shop.update();

  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  // player movement
  if (keys.a.pressed && player.lastKey === "a" && player.position.x > 0) {
    {
      player.velocity.x = -5;
      player.switchSprites("run");
    }
  } else if (
    keys.d.pressed &&
    player.lastKey === "d" &&
    player.position.x < canvas.width
  ) {
    player.velocity.x = 5;
    player.switchSprites("run");
  } else {
    player.switchSprites("idle");
  }

  //jumping
  if (player.velocity.y < 0) {
    player.switchSprites("jump");
  }
  if (player.velocity.y > 0) {
    player.switchSprites("fall");
  }

  // enemy movement
  if (
    keys.ArrowLeft.pressed &&
    enemy.lastKey === "ArrowLeft" &&
    enemy.position.x > 0
  ) {
    enemy.switchSprites("run");
    enemy.velocity.x = -5;
  } else if (
    keys.ArrowRight.pressed &&
    enemy.lastKey === "ArrowRight" &&
    enemy.position.x < canvas.width
  ) {
    enemy.switchSprites("run");
    enemy.velocity.x = 5;
  } else {
    enemy.velocity.x = 0;
    enemy.switchSprites("idle");
  }

  //jumping
  if (enemy.velocity.y < 0) {
    enemy.switchSprites("jump");
  }
  if (enemy.velocity.y > 0) {
    enemy.switchSprites("fall");
  }

  //is anyone attacking?
  //player attacking and enemy gets hit
  if (
    player.isAttacking &&
    player.currentFrame===4&&
    rectangleCollision({ rect1: player, rect2: enemy })
  ) {
    enemy.takeHit()
    player.isAttacking = false;
    document.querySelector("#enemyHealth").style.width = enemy.health + "%";
  }

//if player/enemy miss
if(player.isAttacking && player.currentFrame===4){
    player.isAttacking=false
}
if(enemy.isAttacking && enemy.currentFrame===3){
    enemy.isAttacking=false
}

  if (
    enemy.isAttacking &&
    enemy.currentFrame===2&&
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
