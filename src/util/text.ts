import { Tween } from "~/types";

export function floatingText(
  scene: Phaser.Scene,
  x: number,
  y: number,
  text: string,
  color: string,
  yModifier: number,
  duration: number = 800,
  textSize: number = 8,
  tween: Tween = Tween.Power1,
  delay: number = 0
) {
  if (!scene) return;
  const floatingText = scene.add
    .text(x, y, text, {
      color: color,
      fontFamily: "FutilePro",
      resolution: devicePixelRatio,
      fontSize: `${textSize}px`,
      align: "center",
      stroke: "#000000",
      strokeThickness: 1,
    })
    .setAlpha(0.9)
    .setOrigin(0.5, 1);
  scene.tweens.add({
    targets: floatingText,
    props: {
      y: floatingText.y - yModifier,
      alpha: 0,
    },
    ease: tween,
    duration,
    delay,
    onComplete: (_, targets) => {
      targets.forEach((t) => t.destroy());
    },
  });
}

export const textStyles = {
  small: {
    color: "#FFFFFF",
    fontFamily: "FutilePro",
    resolution: devicePixelRatio,
    fontSize: "16px",
    align: "center",
  },
};
