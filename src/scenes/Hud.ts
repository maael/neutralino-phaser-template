import * as Phaser from "phaser";
import events from "~/util/events";
import { Scene } from "../types";

export class HudScene extends Phaser.Scene {
  constructor() {
    super({ key: Scene.Hud });
  }
  create() {
    this.add.image(40, 40, "blue-button").setScale(2);
    this.add.image(40, 38, "orb-rotate", 0).setScale(0.8);
    this.add.text(36, 55, "Q", {
      color: "#FFFFFF",
      fontFamily: "FutilePro",
      resolution: devicePixelRatio,
      fontSize: "16px",
      align: "center",
    });
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
