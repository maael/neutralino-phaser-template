import * as Phaser from "phaser";

export default class Actor extends Phaser.GameObjects.Container {
  body: Phaser.Physics.Arcade.Body;
  sprite: Phaser.GameObjects.Sprite;
  speed = 8;
  sprintModifier = 1.5;
  key: string;
  texture: string;

  constructor(scene, key, texture) {
    super(scene);
    this.key = key;
    this.texture = texture;
  }

  preload() {
    this.scene.load.spritesheet(this.key, this.texture, {
      frameWidth: 16,
      frameHeight: 32,
    });
  }

  create(x: number, y: number) {
    this.setPosition(x, y);
    this.setSize(16, 21);
    this.scene.physics.world.enable(this);
    this.sprite = this.scene.add.sprite(0, 0, this.key, 1);
    this.body.setOffset(0, -6);
    this.add(this.sprite);

    this.scene.anims.create({
      key: "walkDown",
      frames: this.scene.anims.generateFrameNumbers(this.key, {
        start: 0,
        end: 2,
      }),
      frameRate: 12,
      repeat: -1,
    });
    this.scene.anims.create({
      key: "walkUp",
      frames: this.scene.anims.generateFrameNumbers(this.key, {
        start: 3,
        end: 5,
      }),
      frameRate: 12,
      repeat: -1,
    });
    this.scene.anims.create({
      key: "walkLeft",
      frames: this.scene.anims.generateFrameNumbers(this.key, {
        start: 6,
        end: 8,
      }),
      frameRate: 12,
      repeat: -1,
    });

    this.scene.anims.create({
      key: "runDown",
      frames: this.scene.anims.generateFrameNumbers(this.key, {
        start: 9,
        end: 11,
      }),
      frameRate: 12,
      repeat: -1,
    });
    this.scene.anims.create({
      key: "runUp",
      frames: this.scene.anims.generateFrameNumbers(this.key, {
        start: 12,
        end: 14,
      }),
      frameRate: 12,
      repeat: -1,
    });
    this.scene.anims.create({
      key: "runLeft",
      frames: this.scene.anims.generateFrameNumbers(this.key, {
        start: 15,
        end: 17,
      }),
      frameRate: 12,
      repeat: -1,
    });

    this.setScale(0.8);
    this.sprite.play("walkLeft");
    this.sprite.setFrame(1);

    this.scene.add.existing(this);
  }

  updateVelocity(time: number, delta: number) {
    return { sprintModifier: 1 };
  }

  update(time, delta) {
    if (!this.body) return;
    this.body.setVelocity(0);
    const velocityUpdate = this.updateVelocity(time, delta);
    let animKey = "Left";
    const xVel = this.body.velocity.x;
    const yVel = this.body.velocity.y;

    if (yVel > 0) {
      animKey = "Down";
    } else if (yVel < 0) {
      animKey = "Up";
    }
    if (xVel > 0) {
      animKey = "Right";
    } else if (xVel < 0) {
      animKey = "Left";
    }

    if (xVel === 0 && yVel === 0) {
      this.sprite.stop();
    } else {
      if (animKey === "Right") {
        animKey = "Left";
        this.sprite.setFlipX(true);
      } else {
        this.sprite.setFlipX(false);
      }
      const fullAnim = `${
        velocityUpdate.sprintModifier > 1 ? "run" : "walk"
      }${animKey}`;
      this.sprite.play(fullAnim, true);
    }
  }
}
