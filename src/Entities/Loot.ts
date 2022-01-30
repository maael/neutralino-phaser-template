import { ItemSprite } from "~/types";

export default class Loot extends Phaser.GameObjects.Container {
  body: Phaser.Physics.Arcade.Body;
  item: ItemSprite;
  constructor(scene: Phaser.Scene, x: number, y: number, item: ItemSprite) {
    super(scene, x, y);
    const shadow = scene.add.ellipse(0, 0, 8, 4, 0x000000, 0.2);

    scene.tweens.add({
      targets: shadow,
      props: {
        scaleX: shadow.scaleX - 0.2,
        scaleY: shadow.scaleY - 0.1,
        fillAlpha: 0.1,
      },
      ease: "Power1",
      duration: 800,
      yoyo: true,
      repeat: -1,
    });
    this.add(shadow);
    const sprite = scene.add.sprite(0, -3, "items", item);
    sprite.setScale(0.5);
    this.add(sprite);
    this.item = item;
    scene.physics.world.enable(this);
    this.body.setImmovable(true);
    scene.tweens.add({
      targets: sprite,
      props: {
        y: -8,
      },
      ease: "Power1",
      duration: 800,
      yoyo: true,
      repeat: -1,
    });
    scene.add.existing(this);
    return this;
  }
}

export function chooseFromTable(spec: { [k: number]: number }) {
  var i,
    sum = 0,
    r = Math.random();
  for (i in spec) {
    sum += spec[i];
    if (r <= sum) return i;
  }
}
