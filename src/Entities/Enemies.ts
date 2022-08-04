import * as Phaser from "phaser";
import events from "~/util/events";
import Actor from "./Actor";
import { Bullet } from "./Bullet";
import enemyData, { EnemyType, EnemyData } from "../data/enemies";
import { floatingText } from "~/util/text";

export default class Enemy extends Actor {
  meta: EnemyData;
  constructor(scene, type: EnemyType) {
    super(scene, type, enemyData[type].sprite);
    this.meta = enemyData[type];
  }
  rangeCircle: Phaser.GameObjects.Shape;
  target: null | { x: number; y: number; isPlayer: boolean };
  lastPlace: { x: number; y: number };
  speed = 35;
  aggroRange = 175;
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

    this.sprite.setTint(this.meta.tint);

    this.light = this.scene.lights.addLight(0, 0, 50, this.meta.tint, 0.4);
  }
  takeHit(bullet: Bullet, damage: number) {
    if (!bullet.active) return;
    this.health = Math.max(0, this.health - damage);
    floatingText(
      this.scene,
      this.x - 4 + Phaser.Math.Between(-6, 6),
      this.y - 21 + Phaser.Math.Between(-1, 6),
      `-${damage}`,
      "#FF0000",
      2,
      800,
      6
    );
    if (this.health === 0 && this.active) {
      this.light.intensity = 0;
      this.destroy();
      events.emit("kill:enemy", {
        x: this.x,
        y: this.y,
        type: this.key,
        meta: this.meta,
      });
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
      this.rangeCircle.setFillStyle(this.meta.tint, player ? 0.2 : 0.05);
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
