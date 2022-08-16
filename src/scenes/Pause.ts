import * as Phaser from "phaser";
import { parseGamepad } from "~/util/controls";
import { Scene } from "../types";
import { MainScene } from "./Main";

export class PauseScene extends Phaser.Scene {
  constructor() {
    super({ key: Scene.Pause });
  }
  mainScene: MainScene;
  pauseMenu: Phaser.GameObjects.Group;
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
        if (
          e.keyCode ===
          this.mainScene.world.player.controls.pause.keyboard.keyCode
        ) {
          this.unpause();
        }
      }
    );
    this.input.gamepad.on(
      Phaser.Input.Gamepad.Events.BUTTON_DOWN,
      (_pad, button) => {
        if (
          this.mainScene.world.player.controls.pause.gamepad?.index ===
          button.index
        ) {
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

  scrollMenu(modifier) {
    let newIndex = (this.data.get("selected") || 0) + modifier;
    if (newIndex < 0) {
      newIndex = this.pauseMenu.children.size - 1;
    } else if (newIndex > this.pauseMenu.children.size) {
      newIndex = 0;
    }
    this.data.set("selected", newIndex);
  }

  update(time, delta) {
    const playerGamepad = this.mainScene.world.player.controls._gamepad
      ? this.input.gamepad.getPad(
          this.mainScene.world.player.controls._gamepad.index
        )
      : null;
    const gamepad = parseGamepad(playerGamepad);

    if (gamepad?.down) {
      this.scrollMenu(1);
    } else if (gamepad?.up) {
      this.scrollMenu(-1);
    }

    const activeIndex = this.data.get("selected");
    this.pauseMenu.children.each((item, index) => {
      const text = item as Phaser.GameObjects.Text;
      if (activeIndex === index) {
        this.selectItem(text);
      } else {
        this.deselectItem(text);
      }
    });

    if (playerGamepad?.A) {
      this.pauseMenu.children
        .getArray()
        [this.data.get("selected")].emit("pointerup");
    }
  }

  selectItem(text: Phaser.GameObjects.Text) {
    text.setTint(0x00ff00);
    text.setFontSize(20);
  }

  deselectItem(text: Phaser.GameObjects.Text) {
    text.setTint(0xffffff);
    text.setFontSize(16);
  }

  createPauseMenu() {
    this.data.set("selected", 0);
    this.pauseMenu = this.add.group().setOrigin(0.5);
    const options = [
      { label: "Continue", action: this.unpause },
      { label: "Settings", action: () => undefined },
      { label: "Save", action: () => undefined },
      { label: "Quit", action: this.quit },
    ];
    options.forEach((item, index) => {
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
        this.data.set("selected", index);
        this.selectItem(text);
      });
      text.on("pointerout", () => {
        this.data.set("selected", null);
        this.deselectItem(text);
      });
      this.pauseMenu.add(text);
    });
    Phaser.Actions.GridAlign(this.pauseMenu.getChildren(), {
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
