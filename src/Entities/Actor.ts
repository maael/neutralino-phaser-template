import * as Phaser from "phaser";

export default class Actor extends Phaser.GameObjects.Container {
  body: Phaser.Physics.Arcade.Body;
  sprite: Phaser.GameObjects.Sprite;
  speed = 8;
  sprintModifier = 1.5;
  key: string;
  texture: string;
  directions = { x: 0, y: 1 };
  isInitialised = false;
  health = 100;
  maxHealth = 100;
  healthBar: Phaser.GameObjects.Shape;
  tint = 0xff0000;

  constructor(
    scene: Phaser.Scene,
    key: string,
    texture: string,
    tint?: number
  ) {
    super(scene);
    this.key = key;
    this.texture = texture;
    this.scene = scene;
    if (tint) this.tint = tint;
  }

  create(x: number, y: number) {
    this.setPosition(x, y);
    this.setSize(16, 21);
    this.scene.physics.world.enable(this);
    this.sprite = this.scene.add
      .sprite(0, 0, this.key, 1)
      .setPipeline("Light2D");
    this.body.setOffset(0, -6);
    this.add(this.sprite);
    this.setScale(0.8);
    this.sprite.play("walkLeft");
    this.sprite.setFrame(1);

    const healthBarBg = this.scene.add
      .rectangle(
        -this.sprite.width / 2,
        -this.sprite.height / 1.6,
        this.sprite.width,
        2,
        0x808080,
        0.8
      )
      .setOrigin(0, 0);
    this.healthBar = this.scene.add
      .rectangle(
        -this.sprite.width / 2,
        -this.sprite.height / 1.6,
        this.sprite.width,
        2,
        this.tint,
        0.8
      )
      .setOrigin(0, 0);

    this.add(healthBarBg);
    this.add(this.healthBar);

    this.scene.add.existing(this);
    this.isInitialised = true;
  }

  updateVelocity(time: number, delta: number) {
    return { sprintModifier: 1 };
  }

  handleAction(time: number, delta: number) {
    return;
  }

  update(time, delta) {
    if (!this.isInitialised) this.create(this.x, this.y);
    this.body.setVelocity(0);
    if (!this.active) return;
    const velocityUpdate = this.updateVelocity(time, delta);
    let animKey = "Left";
    const xVel = this.body.velocity.x;
    const yVel = this.body.velocity.y;

    if (yVel > 0) {
      animKey = "Down";
      this.directions.y = 1;
    } else if (yVel < 0) {
      animKey = "Up";
      this.directions.y = -1;
    } else if (xVel !== 0) {
      this.directions.y = 0;
    }
    if (xVel > 0) {
      animKey = "Right";
      this.directions.x = 1;
    } else if (xVel < 0) {
      animKey = "Left";
      this.directions.x = -1;
    } else if (yVel !== 0) {
      this.directions.x = 0;
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

    this.handleAction(time, delta);
    this.healthBar.setScale(this.health / this.maxHealth, 1);
  }
}
