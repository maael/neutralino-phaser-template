import * as Phaser from "phaser";
import { Scene } from "../types";
import { MainScene } from "./Main";

export class PauseScene extends Phaser.Scene {
  constructor() {
    super({ key: Scene.Pause });
  }
  create() {
    const mainScene = this.game.scene.getScene(Scene.Main) as MainScene;
    this.add.rectangle(
      0,
      0,
      mainScene.cameras.main.width * 2,
      mainScene.cameras.main.height * 2,
      0x000000,
      0.5
    );
    this.input.keyboard.addListener(
      Phaser.Input.Keyboard.Events.ANY_KEY_DOWN,
      (e) => {
        if (e.keyCode === mainScene.world.player.controls.pause.keyCode) {
          this.game.scene.resume(Scene.Main);
          this.game.scene.stop(Scene.Pause);
        }
      }
    );
  }
}
