import "phaser";

export default class Background extends Phaser.Scene {
  constructor() {
    super("backgound");
  }

  preload() {
    this.load.image("sky", "assets/nightsky.png");
  }

  create() {
    this.add.image(-160, 0, "sky").setOrigin(0).setScale(1);
  }
}
