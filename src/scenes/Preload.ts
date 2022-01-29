import * as Phaser from "phaser";
import { Scene } from "../types";

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: Scene.Preload });
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

    this.scene.launch(Scene.Main);
    this.scene.launch(Scene.Hud);
    this.scene.stop(Scene.Preload);
  }
}
