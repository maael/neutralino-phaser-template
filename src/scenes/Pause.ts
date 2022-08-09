import * as Phaser from "phaser";
import { Scene } from "../types";
import { MainScene } from "./Main";

export class PauseScene extends Phaser.Scene {
  constructor() {
    super({ key: Scene.Pause });
  }
  mainScene: MainScene;
  create() {
    this.mainScene = this.game.scene.getScene(Scene.Main) as MainScene;
    this.add.rectangle(
      0,
      0,
      this.mainScene.cameras.main.width * 2,
      this.mainScene.cameras.main.height * 2,
      0x000000,
      0.5
    );
    this.input.keyboard.addListener(
      Phaser.Input.Keyboard.Events.ANY_KEY_DOWN,
      (e) => {
        if (e.keyCode === this.mainScene.world.player.controls.pause.keyCode) {
          this.unpause();
        }
      }
    );
    this.createPauseMenu();
  }

  unpause = () => {
    this.game.scene.resume(Scene.Main);
    this.game.scene.stop(Scene.Pause);
  };

  quit = () => {
    Neutralino.app.exit();
  };

  createPauseMenu() {
    const group = this.add.group().setOrigin(0.5);
    const options = [
      { label: "Continue", action: this.unpause },
      { label: "Settings", action: () => undefined },
      { label: "Save", action: () => undefined },
      { label: "Quit", action: this.quit },
    ];
    options.forEach((item) => {
      const text = this.add
        .text(0, 0, item.label, {
          color: "#FFFFFF",
          fontFamily: "FutilePro",
          resolution: devicePixelRatio,
          fontSize: "16px",
          align: "center",
        })
        .setInteractive();
      text.on("pointerup", item.action);
      text.on("pointerover", () => {
        text.setTint(0x00ff00);
        text.setFontSize(20);
      });
      text.on("pointerout", () => {
        text.setTint(0xffffff);
        text.setFontSize(16);
      });
      group.add(text);
    });
    Phaser.Actions.GridAlign(group.getChildren(), {
      width: 100,
      height: -1,
      cellWidth: 100,
      cellHeight: 50,
      x: this.mainScene.cameras.main.width / 2,
      y: this.mainScene.cameras.main.height / 2,
      position: Phaser.Display.Align.CENTER,
    });
  }
}
