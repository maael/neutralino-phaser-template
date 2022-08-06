import * as Phaser from "phaser";
import { Scene } from "../types";
import Player from "../Entities/Player";
import World from "~/Entities/World";
import events from "~/util/events";

export class MainScene extends Phaser.Scene {
  world: World;
  meta = { kills: 0, startedAt: 0, lastAliveAt: 0 };

  constructor() {
    super({ key: Scene.Main });
    this.world = new World(this);
  }

  preload() {
    this.scene.sendToBack();
    this.world.player = new Player(this);
    this.world.enemies = this.add.group([], { runChildUpdate: true });
    this.world.loot = this.add.group([], { runChildUpdate: true });
  }
  create() {
    this.meta = { kills: 0, startedAt: 0, lastAliveAt: 0 };
    this.world.create();
    for (let i = 0; i < (NL_ENVIRONMENT === "production" ? 4 : 2); i++) {
      this.world.spawnEnemy();
    }
    events.on("kill:enemy", () => {
      this.meta.kills++;
    });
  }
  update(time, delta) {
    this.meta.startedAt = time;
    this.world.player.update(time, delta);
    if (
      this.world.enemies.getLength() < (DEBUG ? 20 : 200) &&
      Math.random() > 0.9
    ) {
      this.world.spawnEnemy();
    }
    if (this.world.player.active) {
      this.meta.lastAliveAt = time;
    }
  }
}
