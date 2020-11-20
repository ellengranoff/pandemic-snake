import Phaser, { Game } from "phaser";
import Background from "./scenes/Background";

const canvas = document.getElementById("game-canvas");
const config = {
  type: Phaser.WEB_GL,
  width: 800,
  height: 600,
  canvas,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 1500 },
      debug: true,
    },
  },
  scene: [Background],
};

const game = new Game(config);
