import { ItemSprite } from "~/types";

export enum EnemyType {
  EvilThief = "EvilThief",
  IceThief = "IceThief",
}

export default {
  [EnemyType.EvilThief]: {
    sprite: "sprites/player.png",
    tint: 0xff0000,
    loot: {
      [ItemSprite.Bone]: 0.2,
      [ItemSprite.HealthPotion1]: 0.3,
      [ItemSprite.BronzeCoin]: 0.3,
    },
  },
  [EnemyType.IceThief]: {
    sprite: "sprites/player.png",
    tint: 0x0000ff,
    loot: {
      [ItemSprite.Bone]: 0.3,
    },
  },
};
