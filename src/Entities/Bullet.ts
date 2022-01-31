import * as Phaser from "phaser";
import Enemy from "./Enemies";

const bulletData = {
  lightning: {
    speed: 300,
    maxTime: 1000,
    max: 5,
    damage: 2,
  },
  "orb-rotate": {
    speed: 150,
    maxTime: 500,
    max: 1,
    damage: 4,
  },
};

export class Bullets extends Phaser.Physics.Arcade.Group {
  damage = 2;
  constructor(scene, texture) {
    super(scene.physics.world, scene);
    const data = bulletData[texture];
    this.damage = data.damage;

    this.createMultiple({
      frameQuantity: 5,
      key: texture,
      active: false,
      visible: false,
      classType: Bullet,
      max: data.max,
    });
    this.scene.physics.add.overlap(
      this,
      (this.scene as any).world.enemies,
      (ob1: Enemy, ob2: Bullet) => {
        if (ob1.takeHit) ob1.takeHit(ob2, this.damage);
      }
    );
  }

  fireBullet(x, y, xDirection, yDirection) {
    const bullet = this.getFirstDead(false);

    if (bullet) {
      bullet.fire(x, y, xDirection, yDirection);
    }
  }
}

const directionToRotation = {
  [0]: {
    [0]: 0,
    [1]: 90,
    [-1]: -90,
  },
  [1]: {
    [0]: 0,
    [1]: 45,
    [-1]: -45,
  },
  [-1]: {
    [0]: -180,
    [1]: 135,
    [-1]: -135,
  },
};

export class Bullet extends Phaser.Physics.Arcade.Sprite {
  startTime?: number;
  maxTime = 1000;
  speed = 200;
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    const data = bulletData[texture];
    this.maxTime = data.maxTime;
    this.speed = data.speed;
  }
  fire(x, y, xDirection, yDirection) {
    this.startTime = undefined;
    this.body.reset(x, y);

    this.setActive(true);
    this.setVisible(true);

    this.setVelocity(this.speed * xDirection, this.speed * yDirection);
    this.anims.play(this.texture);
    const rotation = directionToRotation[xDirection][yDirection];
    this.setRotation(rotation * (Math.PI / 180));
  }
  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    if (!this.startTime) this.startTime = time;

    if (time - this.startTime! > this.maxTime) {
      this.setActive(false);
      this.setVisible(false);
    }
  }
}
