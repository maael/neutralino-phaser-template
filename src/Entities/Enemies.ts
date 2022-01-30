import * as Phaser from "phaser";
import events from "~/util/events";
import Actor from "./Actor";
import { Bullet } from "./Bullet";
import enemyData, { EnemyType } from "../data/enemies";

export default class Enemy extends Actor {
  constructor(scene, type: EnemyType) {
    super(scene, type, enemyData[type].sprite);
  }
  rangeCircle: Phaser.GameObjects.Shape;
  target: null | { x: number; y: number; isPlayer: boolean };
  lastPlace: { x: number; y: number };
  speed = 30;
  aggroRange = 150;
  isInitialised = false;
  debug: false;
  light: Phaser.GameObjects.Light;
  damage = 2;
  create(x: number, y: number) {
    if (this.debug) {
      this.rangeCircle = this.scene.add.circle(
        0,
        0,
        this.aggroRange,
        0xff0000,
        0.05
      );
      this.add(this.rangeCircle);
    }
    super.create(x, y);

    this.sprite.setTint(0xff00ff);

    this.light = this.scene.lights.addLight(0, 0, 50, 0xff0000, 0.4);
  }
  takeHit(bullet: Bullet, damage: number) {
    if (!bullet.active) return;
    this.health = Math.max(0, this.health - damage);
    if (this.health === 0 && this.active) {
      this.light.intensity = 0;
      this.destroy();
      events.emit("kill:enemy", { x: this.x, y: this.y, type: this.key });
    }
  }
  update(time: number, delta: number) {
    if (!this.isInitialised) return;
    super.update(time, delta);
    this.light.x = this.x;
    this.light.y = this.y;
  }
  updateVelocity(time: number, delta: number) {
    const sprintModifier = this.target && this.target.isPlayer ? 2 : 1;
    const bodies = this.scene.physics.overlapCirc(
      this.x,
      this.y,
      this.aggroRange,
      true,
      true
    );
    const player = [...bodies].find(
      (b) => (b.gameObject as any).key === "player"
    );
    if (this.debug)
      this.rangeCircle.setFillStyle(0xff0000, player ? 0.2 : 0.05);
    if (player) {
      this.target = { x: player.x, y: player.y, isPlayer: true };
    } else {
      if (
        !this.target ||
        this.target.isPlayer ||
        Phaser.Math.Distance.BetweenPointsSquared(this.target, {
          x: this.x,
          y: this.y,
        }) < 10 ||
        (this.lastPlace.x === this.x && this.lastPlace.y === this.y)
      ) {
        this.target = {
          x: Math.max(0, this.x + Phaser.Math.Between(-100, 100)),
          y: Math.max(0, this.y + Phaser.Math.Between(-100, 100)),
          isPlayer: false,
        };
      }
    }
    this.lastPlace = { x: this.x, y: this.y };
    this.scene.physics.moveTo(
      this,
      this.target.x,
      this.target.y,
      this.speed * this.sprintModifier
    );
    return { sprintModifier };
  }
}
