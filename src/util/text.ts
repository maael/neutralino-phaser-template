export function floatingText(
  scene: Phaser.Scene,
  x: number,
  y: number,
  text: string,
  color: string,
  yModifier: number,
  duration: number = 800,
  textSize: number = 8
) {
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
    .setAlpha(0.9);
  scene.tweens.add({
    targets: floatingText,
    props: {
      y: floatingText.y - yModifier,
      alpha: 0,
    },
    ease: "Power1",
    duration,
    onComplete: (_, targets) => {
      targets.forEach((t) => t.destroy());
    },
  });
}
