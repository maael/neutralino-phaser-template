import * as Phaser from "phaser";
import events from "~/util/events";
import { textStyles } from "~/util/text";
import { Scene } from "../types";
import { MainScene } from "./Main";

export class HudScene extends Phaser.Scene {
  fps: Phaser.GameObjects.Text;
  playerHud: Partial<{
    health: Phaser.GameObjects.Text;
    speedX: Phaser.GameObjects.Text;
    speedY: Phaser.GameObjects.Text;
    enemies: Phaser.GameObjects.Text;
    xp: Phaser.GameObjects.Text;
    level: Phaser.GameObjects.Text;
  }> = {};

  constructor() {
    super({ key: Scene.Hud });
  }
  addButtons() {
    const buttons = [
      {
        sprite: "orb-rotate",
        button: "Q",
      },
      {
        sprite: "lightning",
        button: "E",
      },
    ];
    const group = this.add.group();
    const width = buttons.length * 32;
    buttons.forEach((item) => {
      const container = this.add.container();
      container.add(this.add.image(0, 0, "blue-button").setScale(2));
      container.add(this.add.image(0, -2, item.sprite, 0).setScale(0.8));
      container.add(
        this.add.text(-4, 15, item.button, {
          color: "#FFFFFF",
          fontFamily: "FutilePro",
          resolution: devicePixelRatio,
          fontSize: "16px",
          align: "center",
        })
      );

      group.add(container);
    });
    Phaser.Actions.GridAlign(group.getChildren(), {
      width: width,
      height: 100,
      cellWidth: 32,
      cellHeight: 32,
      x: 40,
      y: 40,
    });
  }
  addPlayerInfo() {
    this.playerHud.health = this.add
      .text(this.cameras.main.width - 4, 32, `Health: 0`, textStyles.small)
      .setOrigin(1, 1);
    this.playerHud.speedX = this.add
      .text(this.cameras.main.width - 4, 48, `Speed X: 0`, textStyles.small)
      .setOrigin(1, 1);
    this.playerHud.speedY = this.add
      .text(this.cameras.main.width - 4, 64, `Speed Y: 0`, textStyles.small)
      .setOrigin(1, 1);
    this.playerHud.enemies = this.add
      .text(this.cameras.main.width - 4, 80, `Enemies: 0`, textStyles.small)
      .setOrigin(1, 1);
    this.playerHud.level = this.add
      .text(this.cameras.main.width - 4, 96, `Level: 0`, textStyles.small)
      .setOrigin(1, 1);
    this.playerHud.xp = this.add
      .text(this.cameras.main.width - 4, 112, `XP: 0`, textStyles.small)
      .setOrigin(1, 1);
  }
  create() {
    this.addButtons();
    if (DEBUG) this.addPlayerInfo();
    events.on("died", (data) => {
      events.removeAllListeners();
      this.add
        .text(
          this.cameras.main.width / 2,
          this.cameras.main.height / 2,
          "You Died",
          {
            color: "#FF0000",
            fontFamily: "FutilePro",
            resolution: devicePixelRatio,
            fontSize: "128px",
            align: "center",
          }
        )
        .setOrigin(0.5, 1);
      this.add
        .text(
          this.cameras.main.width / 2,
          this.cameras.main.height / 2 + 64,
          `Kills: ${data.kills}`,
          {
            color: "#FFFFFF",
            fontFamily: "FutilePro",
            resolution: devicePixelRatio,
            fontSize: "64px",
            align: "center",
          }
        )
        .setOrigin(0.5, 1);
      this.add
        .text(
          this.cameras.main.width / 2,
          this.cameras.main.height / 2 + 200,
          `Click to retry`,
          {
            color: "#FFFFFF",
            fontFamily: "FutilePro",
            resolution: devicePixelRatio,
            fontSize: "32px",
            align: "center",
          }
        )
        .setOrigin(0.5, 1);
      const countedInventory = data.inventory.reduce(
        (acc, i) => ({ ...acc, [i]: (acc[i] || 0) + 1 }),
        {}
      );
      const inventoryGroup = this.add.group();
      const width = Object.keys(countedInventory).length * 32;
      Object.entries(countedInventory).forEach((item) => {
        const itemContainer = this.add.container();
        itemContainer.add(this.add.sprite(0, 0, "items", item[0]));
        itemContainer.add(
          this.add
            .text(0, 28, `x${item[1]}`, {
              color: "#FFFFFF",
              fontFamily: "FutilePro",
              resolution: devicePixelRatio,
              fontSize: "16px",
              align: "center",
            })
            .setOrigin(0.5, 1)
        );

        inventoryGroup.add(itemContainer);
      });
      Phaser.Actions.GridAlign(inventoryGroup.getChildren(), {
        width: width,
        height: 100,
        cellWidth: 32,
        cellHeight: 32,
        x: this.cameras.main.width / 2 - 32,
        y: this.cameras.main.height / 2 + 100,
      });
      this.input.once("pointerup", () => {
        this.scene.stop(Scene.Hud);
        this.scene.stop(Scene.Main);
        this.scene.start(Scene.Preload);
      });
    });
    this.fps = this.add
      .text(this.cameras.main.width - 4, 16, `0fps`, {
        color: "#FFFFFF",
        fontFamily: "FutilePro",
        resolution: devicePixelRatio,
        fontSize: "16px",
        align: "center",
      })
      .setOrigin(1, 1);
  }
  update(time, delta) {
    if (this.fps) {
      this.fps.setText(`${this.game.loop.actualFps.toFixed(0)}fps`);
      this.fps.update(time, delta);
    }
    const mainScene = this.game.scene.getScene(Scene.Main);
    this.playerHud.health?.setText(
      `Health: ${(mainScene as MainScene).world.player.health}`
    );
    this.playerHud.speedX?.setText(
      `Speed X: ${(mainScene as MainScene).world.player.body.velocity.x.toFixed(
        0
      )}`
    );
    this.playerHud.speedY?.setText(
      `Speed Y: ${(mainScene as MainScene).world.player.body.velocity.y.toFixed(
        0
      )}`
    );
    this.playerHud.enemies?.setText(
      `Enemies: ${(mainScene as MainScene).world.enemies.getLength()}`
    );
    this.playerHud.level?.setText(
      `Level: ${(mainScene as MainScene).world.player.level}`
    );
    this.playerHud.xp?.setText(
      `XP: ${(mainScene as MainScene).world.player.xp}`
    );
  }
}
