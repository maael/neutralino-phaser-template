import * as Phaser from "phaser";
import events from "~/util/events";
import Actor from "./Actor";
import { Bullets } from "./Bullet";

export default class Player extends Actor {
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  controls: {
    sprint: Phaser.Input.Keyboard.Key;
    skill1: Phaser.Input.Keyboard.Key;
    skill2: Phaser.Input.Keyboard.Key;
  };
  bullets: Bullets;
  light: Phaser.GameObjects.Light;
  constructor(scene) {
    super(scene, "player", "sprites/player.png", 0x00ff00);
  }
  create(x: number, y: number) {
    super.create(x, y);
    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.controls = {
      sprint: this.scene.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.SHIFT
      ),
      skill1: this.scene.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.E
      ),
      skill2: this.scene.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.Q
      ),
    };
    this.bullets = new Bullets(this.scene, "orb-rotate");

    this.light = this.scene.lights.addLight(0, 0, 400, 0xdddddd, 0.8);
  }
  onCollide(obj) {
    this.health = Math.max(0, this.health - obj.damage);
    if (this.health === 0 && this.active) {
      this.light.intensity = 0;
      this.setActive(false);
      this.setVisible(false);
      events.emit("died", (this.scene as any).meta);
    }
  }
  update(time: number, delta: number) {
    super.update(time, delta);
  }
  updateVelocity(time: number, delta: number) {
    let sprintModifier = 1;

    if (this.controls.sprint.isDown) {
      sprintModifier = this.sprintModifier;
    }
    if (this.cursors.left.isDown) {
      this.body.setVelocityX(-this.speed * sprintModifier * delta);
    } else if (this.cursors.right.isDown) {
      this.body.setVelocityX(this.speed * sprintModifier * delta);
    }

    if (this.cursors.up.isDown) {
      this.body.setVelocityY(-this.speed * sprintModifier * delta);
    } else if (this.cursors.down.isDown) {
      this.body.setVelocityY(this.speed * sprintModifier * delta);
    }

    this.light.x = this.x;
    this.light.y = this.y;

    return { sprintModifier };
  }
  handleAction(time: number, delta: number) {
    if (this.controls.skill1.isDown) {
      const particles = this.scene.add.particles("orb-rotate");
      particles.createEmitter({
        alpha: { start: 0.5, end: 0.5 },
        speed: 2,
        scale: 0.2,
        lifespan: { min: 1, max: 1 },
        blendMode: Phaser.BlendModes.ADD,
        frequency: 1,
        maxParticles: 1,
        x: 0,
        y: 0,
      });
      this.add(particles);
    }
    if (this.controls.skill2.isDown) {
      this.bullets.fireBullet(
        this.x,
        this.y,
        this.directions.x,
        this.directions.y
      );
    }
  }
}
