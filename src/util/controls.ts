export function parseGamepad(gamepad: Phaser.Input.Gamepad.Gamepad | null) {
  const gamepadThreshold = 2 * (gamepad?.axes[0].threshold || 0);
  return gamepad
    ? {
        left: gamepad.leftStick.x < -gamepadThreshold,
        right: gamepad.leftStick.x > gamepadThreshold,
        up: gamepad.leftStick.y < -gamepadThreshold,
        down: gamepad.leftStick.y > gamepadThreshold,
      }
    : null;
}
