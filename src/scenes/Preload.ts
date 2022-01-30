import * as Phaser from "phaser";
import { Scene } from "../types";

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: Scene.Preload });
  }
  preload() {
    /**
     * Maps
     */
    this.load.image("tiles-1", "tiles/jawbreaker_tiles.png");

    /**
     * UX
     */
    this.load.image("blue-button", "ux/BlueBtn.png");

    /**
     * Player
     */
    this.load.spritesheet("player", "sprites/player.png", {
      frameWidth: 16,
      frameHeight: 32,
    });

    /**
     * Items
     */
    this.load.spritesheet("items", "sprites/kyrise.png", {
      frameWidth: 16,
      frameHeight: 16,
    });

    /**
     * FX
     */
    this.load.spritesheet("orb-rotate", "fx/orb-rotate.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
  }
  create() {
    const screenCenterX =
      this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const screenCenterY =
      this.cameras.main.worldView.y + this.cameras.main.height / 2;
    this.add
      .text(screenCenterX, screenCenterY, "Loading...", {
        color: "#FFFFFF",
        fontFamily: "FutilePro",
      })
      .setOrigin(0.5);

    /**
     * fx
     */
    this.anims.create({
      key: "orb-rotate-spin",
      frames: this.anims.generateFrameNumbers("orb-rotate", {
        start: 0,
        end: 3,
      }),
      frameRate: 24,
      repeat: -1,
    });

    /**
     * Player
     */
    this.anims.create({
      key: "walkDown",
      frames: this.anims.generateFrameNumbers("player", {
        start: 0,
        end: 2,
      }),
      frameRate: 12,
      repeat: -1,
    });
    this.anims.create({
      key: "walkUp",
      frames: this.anims.generateFrameNumbers("player", {
        start: 3,
        end: 5,
      }),
      frameRate: 12,
      repeat: -1,
    });
    this.anims.create({
      key: "walkLeft",
      frames: this.anims.generateFrameNumbers("player", {
        start: 6,
        end: 8,
      }),
      frameRate: 12,
      repeat: -1,
    });

    this.anims.create({
      key: "runDown",
      frames: this.anims.generateFrameNumbers("player", {
        start: 9,
        end: 11,
      }),
      frameRate: 12,
      repeat: -1,
    });
    this.anims.create({
      key: "runUp",
      frames: this.anims.generateFrameNumbers("player", {
        start: 12,
        end: 14,
      }),
      frameRate: 12,
      repeat: -1,
    });
    this.anims.create({
      key: "runLeft",
      frames: this.anims.generateFrameNumbers("player", {
        start: 15,
        end: 17,
      }),
      frameRate: 12,
      repeat: -1,
    });

    this.scene.launch(Scene.Main);
    this.scene.launch(Scene.Hud);
    this.scene.stop(Scene.Preload);
  }
}
