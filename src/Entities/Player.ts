import * as Phaser from "phaser";
import Actor from "./Actor";

export default class Player extends Actor {
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  controls: {
    sprint: Phaser.Input.Keyboard.Key;
  };
  constructor(scene) {
    super(scene, "player", "sprites/player.png");
  }
  create(x: number, y: number) {
    super.create(x, y);
    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.controls = {
      sprint: this.scene.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.SHIFT
      ),
    };
  }
  updateVelocity(time: number, delta: number) {
    let sprintModifier = 1;

    if (this.controls.sprint.isDown) {
      sprintModifier = this.sprintModifier;
    }
    if (this.cursors.left.isDown) {
      this.body.setVelocityX(-this.speed * sprintModifier * delta);
    } else if (this.cursors.right.isDown) {
      this.body.setVelocityX(this.speed * sprintModifier * delta);
    }

    if (this.cursors.up.isDown) {
      this.body.setVelocityY(-this.speed * sprintModifier * delta);
    } else if (this.cursors.down.isDown) {
      this.body.setVelocityY(this.speed * sprintModifier * delta);
    }

    return { sprintModifier };
  }
}
