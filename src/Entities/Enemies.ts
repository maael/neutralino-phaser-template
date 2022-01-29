import * as Phaser from "phaser";
import Actor from "./Actor";

export default class Enemy extends Actor {
  constructor(scene) {
    super(scene, "enemy", "sprites/player.png");
  }
  rangeCircle: Phaser.GameObjects.Shape;
  target: null | { x: number; y: number; isPlayer: boolean };
  lastPlace: { x: number; y: number };
  speed: number = 50;
  create(x: number, y: number) {
    super.create(x, y);
    this.sprite.setTint(0xff00ff);
    this.rangeCircle = this.scene.add.circle(0, 0, 100, 0xff0000, 0.1);
    this.add(this.rangeCircle);
  }
  updateVelocity(time: number, delta: number) {
    return { sprintModifier: this.target && this.target.isPlayer ? 2 : 1 };
  }
  update(time, delta) {
    super.update(time, delta);
    if (!this.rangeCircle) return;
    const bodies = this.scene.physics.overlapCirc(
      this.x,
      this.y,
      100,
      true,
      true
    );
    const player = [...bodies].find(
      (b) => (b.gameObject as any).key === "player"
    );
    this.rangeCircle.setFillStyle(0xff0000, player ? 0.5 : 0.05);
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
  }
}
