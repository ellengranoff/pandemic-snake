import Phaser from "phaser";

const config = {
  type: Phaser.AUTO,
  width: 888,
  height: 500,
  backgroundColor: "#F03B21",
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

let snake, covid, cursors, toiletpaper, scoreText;
let score = 0;

//  Direction consts
const UP = 0;
const DOWN = 1;
const LEFT = 2;
const RIGHT = 3;

var game = new Phaser.Game(config);

function preload() {
  this.load.image("toiletpaper", "assets/toiletpaper.png");
  this.load.image("map", "assets/usmap.jpeg");
  this.load.image("face", "assets/maskface.png");
  this.load.image("covid", "assets/covid.png");
  this.load.audio("bling", "assets/audio/bling.wav");
}

function create() {
  this.add.image(444, 250, "map").setScale(0.8);
  scoreText = this.add.text(700, 0, "score: 0", {
    fontSize: "32px",
    color: "red",
  });
  let ToiletPaper = new Phaser.Class({
    Extends: Phaser.GameObjects.Image,
    initialize: function ToiletPaper(scene, x, y) {
      Phaser.GameObjects.Image.call(this, scene);
      this.setTexture("toiletpaper");
      this.setPosition(x * 20, y * 20);
      this.setOrigin(0);
      this.setScale(0.06);
      this.total = 0;
      scene.children.add(this);
    },
    consume: function () {
      this.total++;
      let x = Phaser.Math.Between(0, 41);
      let y = Phaser.Math.Between(0, 19);
      this.setPosition(x * 21, y * 21);
    },
  });
  let Covid = new Phaser.Class({
    Extends: Phaser.GameObjects.Image,
    initialize: function Covid(scene, x, y) {
      Phaser.GameObjects.Image.call(this, scene);
      this.setTexture("covid");
      this.setPosition(x * 20, y * 20);
      this.setOrigin(0);
      this.setScale(0.06);
      this.total = 0;
      scene.children.add(this);
    },
    // outbreak: function () {
    //   if (score % 5 === 0) {
    //     this.total++;
    //     let x = Phaser.Math.Between(0, 41);
    //     let y = Phaser.Math.Between(0, 19);
    //     this.setPosition(x * 21, y * 21);
    //   }
    // },
  });
  let Snake = new Phaser.Class({
    initialize: function Snake(scene, x, y) {
      this.headPosition = new Phaser.Geom.Point(x, y);
      this.body = scene.add.group();
      this.head = this.body.create(x * 21, y * 21, "face").setScale(0.05);
      this.head.setOrigin(0);
      this.tail = new Phaser.Geom.Point(x, y);
      this.alive = true;
      this.speed = 160;
      this.moveTime = 0;
      this.heading = RIGHT;
      this.direction = RIGHT;
    },

    update: function (time) {
      scoreText.text = `Score: ${score}`;
      if (time >= this.moveTime) {
        return this.move(time);
      }
    },

    faceLeft: function () {
      if (this.direction === UP || this.direction === DOWN) {
        this.heading = LEFT;
      }
    },

    faceRight: function () {
      if (this.direction === UP || this.direction === DOWN) {
        this.heading = RIGHT;
      }
    },

    faceUp: function () {
      if (this.direction === LEFT || this.direction === RIGHT) {
        this.heading = UP;
      }
    },

    faceDown: function () {
      if (this.direction === LEFT || this.direction === RIGHT) {
        this.heading = DOWN;
      }
    },

    move: function (time) {
      switch (this.heading) {
        case LEFT:
          this.headPosition.x = Phaser.Math.Wrap(
            this.headPosition.x - 1,
            0,
            42
          );
          break;

        case RIGHT:
          this.headPosition.x = Phaser.Math.Wrap(
            this.headPosition.x + 1,
            0,
            42
          );
          break;

        case UP:
          this.headPosition.y = Phaser.Math.Wrap(
            this.headPosition.y - 1,
            0,
            25
          );
          break;

        case DOWN:
          this.headPosition.y = Phaser.Math.Wrap(
            this.headPosition.y + 1,
            0,
            25
          );
          break;
      }

      this.direction = this.heading;

      Phaser.Actions.ShiftPosition(
        this.body.getChildren(),
        this.headPosition.x * 21,
        this.headPosition.y * 21,
        1,
        this.tail
      );

      var deadSnake = Phaser.Actions.GetFirst(
        //gets all snake children to compare with the value of the head
        this.body.getChildren(),
        { x: this.head.x, y: this.head.y },
        1
      );

      if (deadSnake) {
        this.alive = false;
        alert(`GAME OVER! Your Score Was: ${score}`);
      } else {
        this.moveTime = time + this.speed;
        return true;
      }
    },
    grow: function () {
      let newPart = this.body.create(this.tail.x, this.tail.y, "face");
      newPart.setScale(0.05);
      newPart.setOrigin(0);
    },
    collideWithFood: function (toiletpaper, covid) {
      let differenceX = Math.abs(this.head.x - toiletpaper.x);
      let differenceY = Math.abs(this.head.y - toiletpaper.y);
      if (differenceX < 5 && differenceY < 5) {
        score++;
        this.grow();
        toiletpaper.consume();
        // covid.outbreak();
        return true;
      } else {
        return false;
      }
    },
  });

  toiletpaper = new ToiletPaper(this, 3, 4);
  snake = new Snake(this, 8, 8);
  // covid = new Covid(this, 20, 20);
  cursors = this.input.keyboard.createCursorKeys();
}

function update(time, delta) {
  if (!snake.alive) {
    return;
  }
  if (cursors.left.isDown) {
    snake.faceLeft();
  } else if (cursors.right.isDown) {
    snake.faceRight();
  } else if (cursors.up.isDown) {
    snake.faceUp();
  } else if (cursors.down.isDown) {
    snake.faceDown();
  }

  if (snake.update(time)) {
    snake.collideWithFood(toiletpaper, covid);
  }
}
