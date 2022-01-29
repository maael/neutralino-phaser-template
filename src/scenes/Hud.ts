import * as Phaser from "phaser";
import events from "~/util/events";
import { Scene } from "../types";

export class HudScene extends Phaser.Scene {
  constructor() {
    super({ key: Scene.Hud });
  }
  create() {
    events.on("died", (data) => {
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
      events.removeAllListeners();
      setTimeout(() => {
        this.scene.stop(Scene.Hud);
        this.scene.stop(Scene.Main);
        this.scene.start(Scene.Preload);
      }, 5_000);
    });
  }
}
