import * as Phaser from "phaser";
import Enemy from "./Enemies";

export class Bullets extends Phaser.Physics.Arcade.Group {
  damage = 2;
  constructor(scene, texture) {
    super(scene.physics.world, scene);

    this.createMultiple({
      frameQuantity: 5,
      key: texture,
      active: false,
      visible: false,
      classType: Bullet,
      max: 1,
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

export class Bullet extends Phaser.Physics.Arcade.Sprite {
  startTime?: number;
  maxTime = 1000;
  speed = 200;
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
  }
  fire(x, y, xDirection, yDirection) {
    this.startTime = undefined;
    this.body.reset(x, y);

    this.setActive(true);
    this.setVisible(true);

    this.setVelocity(this.speed * xDirection, this.speed * yDirection);
    this.anims.play("orb-rotate-spin");
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
