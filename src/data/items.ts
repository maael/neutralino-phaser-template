import Player from "~/Entities/Player";
import { ItemSprite } from "~/types";

export default {
  [ItemSprite.HealthPotion1]: function (player: Player) {
    player.health = Math.min(player.maxHealth, player.health + 20);
  },
};
