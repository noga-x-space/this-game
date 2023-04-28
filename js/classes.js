class Sprite {
  constructor({ position, imageSRC, scale = 1, framesNumber = 1 }) {
    this.position = position;
    this.width = 50;
    this.height = 150;
    this.image = new Image();
    this.image.src = imageSRC;
    this.scale = scale;
    this.framesNumber = framesNumber; //number of frames in the img
    this.currentFrame = 0; //what frame are we on
    this.framesElapsed = 0; //total number of frames that were elapsed over
    this.framesHold = 5; // how many frames should we go through before changing the current one
  }

  draw() {
    c.drawImage(
      this.image,
      //animation-cropping by number of pictures in one image
      (this.currentFrame * this.image.width) / this.framesNumber, //the x position it starts from
      0, //the y position it starts from
      this.image.width / this.framesNumber,
      this.image.height,

      this.position.x,
      this.position.y,
      (this.image.width / this.framesNumber) * this.scale,
      this.image.height * this.scale
    );
  }

  update() {
    this.draw();
    this.framesElapsed++;

    if (this.framesElapsed % this.framesHold === 0) {
      if (this.currentFrame < this.framesNumber - 1) this.currentFrame++;
      else this.currentFrame = 0;
    }
  }
}

class Fighter {
  constructor({ position, velocity, color, offset }) {
    this.position = position;
    this.velocity = velocity;
    this.width = 50;
    this.height = 150;
    this.lastKey;
    this.color = color;
    this.health = 100;
    this.attackbox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: 100,
      height: 50,
      offset,
    };
    this.isAttacking;
  }

  draw() {
    c.fillStyle = this.color;
    c.fillRect(this.position.x, this.position.y, this.width, this.height);

    //attackbox
    if (this.isAttacking) {
      c.fillStyle = "yellow";
      c.fillRect(
        this.attackbox.position.x,
        this.attackbox.position.y,
        this.attackbox.width,
        this.attackbox.height
      );
    }
  }

  update() {
    this.draw();

    this.attackbox.position.x = this.position.x - this.attackbox.offset.x;
    this.attackbox.position.y = this.position.y - this.attackbox.offset.y;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
      this.velocity.y = 0;
    } else {
      this.velocity.y += gravity;
    }
  }

  attack() {
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 400);
  }
}
