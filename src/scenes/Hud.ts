import * as Phaser from "phaser";
import events from "~/util/events";
import { Scene } from "../types";

export class HudScene extends Phaser.Scene {
  constructor() {
    super({ key: Scene.Hud });
  }
  create() {
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
            color: "#FF0000",
            fontFamily: "FutilePro",
            resolution: devicePixelRatio,
            fontSize: "64px",
            align: "center",
          }
        )
        .setOrigin(0.5, 1);
      const countedInventory = data.inventory.reduce(
        (acc, i) => ({ ...acc, [i]: (acc[i] || 0) + 1 }),
        {}
      );
      Object.entries(countedInventory).forEach((item) => {
        this.add.sprite(
          this.cameras.main.width / 2,
          this.cameras.main.height / 2 + 100,
          "items",
          item[0]
        );
        this.add
          .text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 + 138,
            `x${item[1]}`,
            {
              color: "#FF0000",
              fontFamily: "FutilePro",
              resolution: devicePixelRatio,
              fontSize: "32px",
              align: "center",
            }
          )
          .setOrigin(0.5, 1);
      });
      setTimeout(() => {
        this.scene.stop(Scene.Hud);
        this.scene.stop(Scene.Main);
        this.scene.start(Scene.Preload);
      }, 5_000);
    });
  }
}
