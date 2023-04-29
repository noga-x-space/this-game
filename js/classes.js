class Sprite {
  constructor({
    position,
    imageSRC,
    scale = 1,
    framesNumber = 1,
    offset = { x: 0, y: 0 },
  }) {
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
    this.offset = offset;
  }

  draw() {
    c.drawImage(
      this.image,
      //animation-cropping by number of pictures in one image
      (this.currentFrame * this.image.width) / this.framesNumber, //the x position it starts from
      0, //the y position it starts from
      this.image.width / this.framesNumber,
      this.image.height,

      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.framesNumber) * this.scale,
      this.image.height * this.scale
    );
  }

  animateFrames() {
    //animation speed
    this.framesElapsed++;
    if (this.framesElapsed % this.framesHold === 0) {
      if (this.currentFrame < this.framesNumber - 1) this.currentFrame++;
      else this.currentFrame = 0;
    }
  }

  update() {
    this.draw();
    this.animateFrames();
  }
}

class Fighter extends Sprite {
  constructor({
    position,
    velocity,
    color,
    imageSRC,
    scale = 1,
    framesNumber = 1,
    offset = { x: 0, y: 0 },
    sprites,
    attackbox = {
      offset: {},
      width: undefined,
      height: undefined,
    },
  }) {
    super({
      position,
      imageSRC,
      scale,
      framesNumber,
      offset,
    });

    //character details and actions
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
      offset: attackbox.offset,
      width: attackbox.width,
      height: attackbox.height,
    };
    this.isAttacking;
    this.sprites = sprites;

    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSrc;
    }

    //animation
    this.currentFrame = 0; //what frame are we on
    this.framesElapsed = 0; //total number of frames that were elapsed over
    this.framesHold = 5; // how many frames should we go through before changing the current one
  }

  update() {
    this.draw();

    this.animateFrames();

    this.attackbox.position.x = this.position.x + this.attackbox.offset.x;
    this.attackbox.position.y = this.position.y + this.attackbox.offset.y;

    //drawing attack boxes
    // c.fillRect(
    //   this.attackbox.position.x,
    //   this.attackbox.position.y,
    //   this.attackbox.width,
    //   this.attackbox.height
    // );

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    //gravity
    if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
      this.velocity.y = 0;
      this.position.y = 330;
    } else {
      this.velocity.y += gravity;
    }
  }

  attack() {
    this.switchSprites("attack1");
    this.isAttacking = true;
  }

  takeHit(){
    this.switchSprites("takeHit")
    this.health -= 20;
  }
  switchSprites(sprite) {
    //overriding all animations with attack/hit
    if (
      this.image === this.sprites.attack1.image &&
      this.currentFrame < this.sprites.attack1.framesNumber - 1
      ||
      this.image ===this.sprites.takeHit.image&&
      this.currentFrame<this.sprites.takeHit.currentFrame-1
    )
      return;
    switch (sprite) {
      case "idle":
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.framesNumber = this.sprites.idle.framesNumber;
          this.currentFrame = 0;
        }

        break;
      case "run":
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.framesNumber = this.sprites.run.framesNumber;
          this.currentFrame = 0;
        }
        break;
      case "jump":
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image;
          this.framesNumber = this.sprites.jump.framesNumber;
          this.currentFrame = 0;
        }
        break;
      case "attack1":
        if (this.image !== this.sprites.attack1.image) {
          this.image = this.sprites.attack1.image;
          this.framesNumber = this.sprites.attack1.framesNumber;
          this.currentFrame = 0;
        }
        break;
      case "fall":
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image;
          this.framesNumber = this.sprites.fall.framesNumber;
          this.currentFrame = 0;
        }
        break;
        case "takeHit":
            if (this.image !== this.sprites.takeHit.image) {
                this.image = this.sprites.takeHit.image;
                this.framesNumber = this.sprites.takeHit.framesNumber;
                this.currentFrame = 0;
              }
    }
  }
}
