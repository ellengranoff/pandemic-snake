import Phaser from "phaser";

const config = {
  type: Phaser.AUTO,
  width: 900,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

let head, tail, cursors, snake, toiletpaper, playerDirection;
const directions = {
  up: 0,
  down: 1,
  left: 2,
  right: 3,
};

const game = new Phaser.Game(config);

function preload() {
  this.load.image("map", "assets/usmap.jpeg");
  this.load.image("maskface", "assets/maskface.png");
  this.load.image("toiletpaper", "assets/toiletpaper.png");
}

function create() {
  this.add.image(400, 300, "map").setScale(1);
  this.add.image(40, 40, "maskface").setScale(0.15);

  cursors = game.input.keyboard.createCursorKeys();
}

function newSnakeHead(x, y) {
  let newHead = {};
  newHead.image = game.add.image(x, y, "maskface");
  newHead.next = null;
}

function update(time, delta) {}
