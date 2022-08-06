import * as Phaser from "phaser";
import items from "~/data/items";
import { ItemSprite, Tween } from "~/types";
import events from "~/util/events";
import { floatingText } from "~/util/text";
import Actor from "./Actor";
import { Bullets } from "./Bullet";
import Enemy from "./Enemies";
import Loot from "./Loot";

const levelXpMap = {
  1: 20,
  2: 30,
  3: 40,
};

export default class Player extends Actor {
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  controls: {
    sprint: Phaser.Input.Keyboard.Key;
    skill1: Phaser.Input.Keyboard.Key;
    skill2: Phaser.Input.Keyboard.Key;
  };
  bullets: Bullets;
  lightning: Bullets;
  light: Phaser.GameObjects.Light;
  inventory: ItemSprite[] = [];
  level: number = 1;
  xp: number = 0;
  isPlayer: boolean = true;
  constructor(scene) {
    super(scene, "player", "sprites/player.png", 0x00ff00);
  }
  handleXp(incomingXp: number) {
    if (incomingXp === 0) return;
    const newXp = this.xp + incomingXp;
    const levelXp = levelXpMap[this.level];
    if (newXp >= levelXp) {
      this.level++;
      this.xp = 0;
      this.floatingText("LEVEL UP!", {
        duration: 2400,
        size: 16,
        colour: 0xffd700,
        tween: Tween.Power0,
        delay: 200,
      });
      this.handleXp(Math.max(newXp - levelXp, 0));
    } else {
      this.xp = newXp;
    }
  }
  floatingText(
    text: string,
    config: Partial<{
      colour: number;
      duration: number;
      size: number;
      tween: Tween;
      delay: number;
    }>
  ) {
    floatingText(
      this.scene,
      this.x,
      this.y - 21 + Phaser.Math.Between(-1, 6),
      text,
      config.colour || 0xffffff,
      2,
      config.duration,
      config.size,
      config.tween,
      config.delay
    );
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
    this.lightning = new Bullets(this.scene, "lightning");

    this.light = this.scene.lights.addLight(0, 0, 400, 0xdddddd, 0.8);

    events.on("kill:enemy", (data) => {
      this.handleXp(data.meta.xp);
    });
  }
  onCollide(obj) {
    if (obj instanceof Enemy) {
      this.health = Math.max(0, this.health - obj.damage);
      if (this.active) {
        this.floatingText(`-${obj.damage}`, { colour: 0xff0000 });
      }
      if (this.health === 0 && this.active) {
        this.light.intensity = 0;
        this.setActive(false);
        this.setVisible(false);
        events.emit(
          "died",
          Object.assign((this.scene as any).meta, { inventory: this.inventory })
        );
      }
    } else if (obj instanceof Loot) {
      if (items[obj.item]) {
        items[obj.item](this);
      } else {
        this.inventory.push(obj.item);
      }
      obj.destroyAll();
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
      this.body.setVelocityX(-this.speed * sprintModifier);
    } else if (this.cursors.right.isDown) {
      this.body.setVelocityX(this.speed * sprintModifier);
    }

    if (this.cursors.up.isDown) {
      this.body.setVelocityY(-this.speed * sprintModifier);
    } else if (this.cursors.down.isDown) {
      this.body.setVelocityY(this.speed * sprintModifier);
    }

    this.light.x = this.x;
    this.light.y = this.y;

    return { sprintModifier };
  }
  handleAction(time: number, delta: number) {
    if (Phaser.Input.Keyboard.JustDown(this.controls.skill1)) {
      this.lightning.fireBullet(
        this.x,
        this.y,
        this.directions.x,
        this.directions.y
      );
    }
    if (Phaser.Input.Keyboard.JustDown(this.controls.skill2)) {
      this.bullets.fireBullet(
        this.x,
        this.y,
        this.directions.x,
        this.directions.y
      );
    }
  }
}
