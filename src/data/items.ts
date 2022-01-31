import Player from "~/Entities/Player";
import { ItemSprite } from "~/types";
import { floatingText } from "~/util/text";

export default {
  [ItemSprite.HealthPotion1]: function (player: Player) {
    const heal = 20;
    player.health = Math.min(player.maxHealth, player.health + heal);
    floatingText(
      player.scene,
      player.x - 8,
      player.y - 23,
      `+${heal}`,
      "#00FF00",
      2
    );
  },
};
