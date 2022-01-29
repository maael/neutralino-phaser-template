import * as Phaser from "phaser";
import { Scene } from "../types";
import Player from "../Entities/Player";
import Enemy from "~/Entities/Enemies";

const BLOCKING_TILES = [13];

const level = Array.from({ length: 100 }, (_, i) =>
  Array.from({ length: 100 }, (_, j) => {
    const rnd = Math.random();
    return i === 0 || i === 99 || j === 0 || j === 99
      ? BLOCKING_TILES[0]
      : rnd > 0.98
      ? BLOCKING_TILES[0]
      : rnd > 0.8
      ? 15
      : 0;
  })
);

export class MainScene extends Phaser.Scene {
  player: Player;
  enemies: Phaser.GameObjects.Group;

  constructor() {
    super({ key: Scene.Main });
  }

  preload() {
    this.load.image("tiles-1", "tiles/jawbreaker_tiles.png");
    this.scene.sendToBack();
    this.player = new Player(this);
    this.player.preload();
    this.enemies = this.add.group([], { runChildUpdate: true });
    for (let i = 0; i < 4; i++) {
      const enemy = new Enemy(this);
      enemy.preload();
      this.enemies.add(enemy);
    }
  }

  create() {
    var map = this.make.tilemap({
      data: level,
      tileWidth: 8,
      tileHeight: 8,
    });
    this.cameras.main.setZoom(3);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    var tiles = map.addTilesetImage("tiles-1");
    var layer = map.createLayer(0, tiles, 0, 0);
    map.setCollision(BLOCKING_TILES, true);
    // const mapDebug = this.add.graphics();
    // map.renderDebug(mapDebug);
    this.player.create(150, 150);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.physics.add.collider(this.player, layer);
    for (const enemy of this.enemies.getChildren()) {
      (enemy as any).create(160 + Math.random() * 100, 160);
    }
    this.physics.add.collider(this.player, this.enemies);
    this.physics.add.collider(this.enemies, layer);
    this.physics.add.collider(this.enemies, this.enemies);
  }
  update(time, delta) {
    this.player.update(time, delta);
  }
}
