import { ItemSprite } from "~/types";

export enum EnemyType {
  EvilThief = "EvilThief",
  IceThief = "IceThief",
}

export interface EnemyData {
  sprite: string;
  tint: number;
  loot: Partial<Record<ItemSprite, number>>;
  xp: number;
}

const enemies: Record<EnemyType, EnemyData> = {
  [EnemyType.EvilThief]: {
    sprite: "sprites/player.png",
    tint: 0xff0000,
    loot: {
      [ItemSprite.Bone]: 0.2,
      [ItemSprite.HealthPotion1]: 0.3,
      [ItemSprite.BronzeCoin]: 0.3,
    },
    xp: 5,
  },
  [EnemyType.IceThief]: {
    sprite: "sprites/player.png",
    tint: 0x72a4d4,
    loot: {
      [ItemSprite.Bone]: 0.3,
      [ItemSprite.BlueNecklace]: 0.3,
    },
    xp: 10,
  },
};

export default enemies;
