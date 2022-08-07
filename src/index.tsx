import * as Phaser from "phaser";
import { MainScene } from "./scenes/Main";
import { HudScene } from "./scenes/Hud";
import { PreloadScene } from "./scenes/Preload";
import { Scene } from "./types";
import { PauseScene } from "./scenes/Pause";

DEBUG = false;

Neutralino.events.on("ready", () => {
  const isProduction = NL_ENVIRONMENT === "production";
  const config: Phaser.Types.Core.GameConfig = {
    physics: {
      default: "arcade",
      arcade: {
        gravity: { x: 0, y: 0 },
        debug: DEBUG, // || !isProduction,
      },
    },
    banner: false,
    pixelArt: true,
    type: Phaser.WEBGL,
    roundPixels: false,
    scale: {
      zoom: 1,
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      autoRound: false,
      width: document.body.clientWidth,
      height: document.body.clientHeight,
    },
    zoom: 1.00000001,
    antialiasGL: false,
    scene: [PreloadScene, HudScene, MainScene, PauseScene],
  };
  const game = new Phaser.Game(config);
  game.scene.start(Scene.Preload);
});
