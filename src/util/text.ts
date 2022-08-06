import { Tween } from "~/types";

export function floatingText(
  scene: Phaser.Scene,
  x: number,
  y: number,
  text: string,
  color: number,
  yModifier: number,
  duration: number = 800,
  textSize: number = 8,
  tween: Tween = Tween.Power1,
  delay: number = 0
) {
  if (!scene) return;
  const floatingText = scene.add
    .bitmapText(x, y, "FutilePro", text, textSize)
    .setAlpha(0.9)
    .setOrigin(0.5, 0.5)
    .setDropShadow(-1, 2, 0x000000, 1)
    .setTint(color);
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
