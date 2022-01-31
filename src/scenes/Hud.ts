import * as Phaser from "phaser";
import events from "~/util/events";
import { Scene } from "../types";

export class HudScene extends Phaser.Scene {
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
  create() {
    this.addButtons();
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
  }
}
