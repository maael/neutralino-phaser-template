import * as Phaser from "phaser";
import enemyData, { EnemyType } from "~/data/enemies";
import { ItemSprite } from "~/types";
import events from "~/util/events";
import Enemy from "./Enemies";
import Loot, { chooseFromTable } from "./Loot";
import Player from "./Player";

export default class World {
  scene: Phaser.Scene;
  player: Player;
  enemies: Phaser.GameObjects.Group;
  loot: Phaser.GameObjects.Group;
  BLOCKING_TILES = [13];
  map: Phaser.Tilemaps.Tilemap;
  constructor(scene) {
    this.scene = scene;
  }
  generateLevel() {
    return Array.from({ length: 100 }, (_, i) =>
      Array.from({ length: 100 }, (_, j) => {
        const rnd = Math.random();
        return i === 0 || i === 99 || j === 0 || j === 99
          ? this.BLOCKING_TILES[0]
          : rnd > 0.99
          ? this.BLOCKING_TILES[0]
          : rnd > 0.8
          ? 15
          : 0;
      })
    );
  }
  create() {
    this.map = this.scene.make.tilemap({
      data: this.generateLevel(),
      tileWidth: 8,
      tileHeight: 8,
    });
    this.scene.cameras.main.setZoom(3);
    this.scene.cameras.main.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    );
    const tiles = this.map.addTilesetImage("tiles-1");
    const layer = this.map.createLayer(0, tiles, 0, 0).setPipeline("Light2D");
    this.map.setCollision(this.BLOCKING_TILES, true);
    // const mapDebug = this.add.graphics();
    // map.renderDebug(mapDebug);
    this.player.create(150, 150);
    this.scene.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.scene.physics.add.collider(this.player, layer);
    this.scene.physics.add.collider(this.player, this.enemies, (ob1, ob2) => {
      if ((ob1 as any).onCollide) (ob1 as any).onCollide(ob2);
    });
    this.scene.physics.add.collider(this.player, this.loot, (ob1, ob2) => {
      if ((ob1 as any).onCollide) (ob1 as any).onCollide(ob2);
    });
    this.scene.physics.add.collider(this.enemies, layer);
    this.scene.physics.add.collider(this.enemies, this.enemies);
    this.scene.lights.enable();
    this.scene.lights.setAmbientColor(0x808080);
    events.on("kill:enemy", (data) => {
      const table = enemyData[data.type]?.loot;
      if (!table) return;
      const item = chooseFromTable(table);
      if (!item) return;
      this.spawnLoot(data.x, data.y, item);
    });
    this.spawnLoot(this.player.x, this.player.y + 2, ItemSprite.Bone);
    this.spawnLoot(this.player.x, this.player.y + 2, ItemSprite.BronzeCoin);
    this.spawnLoot(this.player.x, this.player.y + 2, ItemSprite.BlueNecklace);
  }
  spawnEnemy() {
    const enemy = new Enemy(this.scene, EnemyType.EvilThief);
    enemy.create(
      Math.max(
        10,
        Phaser.Math.Between(this.player.x - 100, this.player.x + 100)
      ),
      Math.max(
        10,
        Phaser.Math.Between(this.player.y - 100, this.player.y + 100)
      )
    );
    this.enemies.add(enemy);
  }
  spawnLoot(x: number, y: number, item: ItemSprite) {
    this.loot.add(new Loot(this.scene, x, y, item));
  }
}
