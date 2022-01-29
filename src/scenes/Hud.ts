import * as Phaser from "phaser";
import { Scene } from "../types";

export class HudScene extends Phaser.Scene {
  constructor() {
    super({ key: Scene.Hud });
  }
  create() {
    this.add.text(10, 10, "|||||", {
      color: "#FF0000",
      fontFamily: "FutilePro",
      resolution: devicePixelRatio,
      fontSize: "32px",
    });
  }
}
