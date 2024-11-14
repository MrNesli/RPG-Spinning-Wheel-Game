const canvas: HTMLCanvasElement = document.getElementById("game-window") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");
const colors = ["orange", "red", "blue", "yellow", "green", "purple"];

if (!ctx) {
  throw new Error("Couldn't get the context.");
}

ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;
// DONE: Main loop
// TODO: Implement Spinning wheel with small action icons
// TODO: Nickname input page - custom input field
// TODO: UI for Game scene (see Figma)
// TODO: Player logic, Spawn attack animations with free target to choose - in Spawn class.
// TODO: Player interface: HP, spawns, spawn_type, perform_action(Action)
// TODO: Game class that will handle whole game's logic: player's action, who's turn, game over condition, etc.
//

function randomNumber(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function drawTriangle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string = "black",
) {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.moveTo(x, y);
  ctx.lineTo(x + size, y - size);
  ctx.lineTo(x - size, y - size);
  ctx.fill();

}

function drawArc(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  start_angle: number,
  end_angle: number,
  stroke: boolean = false,
  fill_style: string = "black",
  stroke_style: string = "red"
) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.fillStyle = fill_style;
  ctx.strokeStyle = stroke_style;
  ctx.arc(x, y, radius, start_angle, end_angle);
  if (stroke) {
    ctx.stroke();
  }
  else {
    ctx.fill();
  }
}

function degrees_to_radians(degree: number): number {
  return degree * (Math.PI / 180);
}

function radians_to_degrees(radian: number): number {
  return radian * (180 / Math.PI);
}
// Math.

function drawSegmentedCircle(
  ctx: CanvasRenderingContext2D,
  number_of_segments: number,
  x: number,
  y: number,
  radius: number,
  rotation: number,
  items: Items,
  debug: boolean = false
) {

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.translate(-x, -y);
  // let segment_angle = (Math.PI / 180) * 360 / number_of_segments; // single segment angle

  let segment_angle = 360 / number_of_segments; // single segment angle
  // let degrees_to_radians = (Math.PI / 180);
  for (let segment = 1; segment <= number_of_segments; segment++) {
    // Range of ith segment's angle converted to radians
    let angle_start = ((segment - 1) * segment_angle);
    let angle_end = segment * segment_angle;

    angle_start = degrees_to_radians(angle_start);
    angle_end = degrees_to_radians(angle_end);

    // Drawing the segment
    drawArc(ctx, x, y, radius, angle_start, angle_end, true);

    let radius_center_x = x + radius / 4 * Math.cos(angle_end);
    let radius_center_y = y + radius / 4 * Math.sin(angle_end);

    if (debug) {
      // Item coordinate point for visual understanding
      drawArc(ctx, radius_center_x, radius_center_y, 9, 0, Math.PI * 2, false, colors[segment - 1]);
    }

    ctx.save(); // saving the state of the context

    ctx.translate(radius_center_x, radius_center_y);

    if (debug) {
      console.log("Segment angle: " + segment_angle);
    }

    // Calculating rotation angle to align the item in its own segment
    // We have to multiply the rotation by -1 if the segment isn't pair 
    // because the circle rotates in the clockwise direction
    let item_rotation = degrees_to_radians(-90) - (degrees_to_radians(segment_angle / 2) + (number_of_segments - segment) * degrees_to_radians(segment_angle));
    ctx.rotate(item_rotation);

    ctx.translate(-radius_center_x, -radius_center_y);

    // Coordinates of the item relative to the rotated point (segment)
    let y_offset = radius / 6;
    let x_offset = -5;

    items[`segment${segment}`].set(radius_center_x + x_offset, radius_center_y + y_offset);
    items[`segment${segment}`].draw();

    ctx.restore(); // restoring the state of the context
  }

  drawArc(ctx, x, y, radius, 0, Math.PI * 2, false, "#3F2631"); // a circle

  ctx.restore();
}


abstract class Scene {
  constructor(
    public ctx: CanvasRenderingContext2D
  ) {
  }

  abstract draw(dt: number): void;
  abstract update(dt: number): void;

  clear() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }
}

class NicknameInputScene extends Scene {
  constructor(ctx: CanvasRenderingContext2D) {
    super(ctx);
  }

  draw(): void {
    this.ctx.fillStyle = "green";
    // console.log("Nickname Input Scene...");
    this.ctx.fillRect(50, 50, 15, 15);
  }

  update(): void {

  }
}

class GameMap {
  assets_loaded: boolean = false;
  tileImg: HTMLImageElement;

  constructor(
    public ctx: CanvasRenderingContext2D,
    public width: number = 200,
    public height: number = 200
  ) {

    this.tileImg = new Image();
    this.tileImg.src = "../images/tile.png";

    this.tileImg.addEventListener("load", () => {
      this.assets_loaded = true;
    });
  }

  draw() {
    if (this.assets_loaded) {
      const pattern = this.ctx.createPattern(this.tileImg, "repeat") as CanvasPattern;
      this.ctx.globalCompositeOperation = 'destination-over'; // Draw the map on the background
      this.ctx.rect(0, 0, this.width, this.height);
      this.ctx.fillStyle = pattern;
      this.ctx.fill();
    }
  }

}

abstract class Spawn {
  abstract draw(x: number, y: number): void;
}

interface Items {
  [key: string]: any;
}

class Wheel {
  wheel_rotation: number;
  wheel_rotation_duration: number;
  wheel_rotation_speed: number;
  wheel_rotation_max_speed: number;
  wheel_rotation_stop: number;
  result_item: any | undefined;
  items: Items;

  constructor(
    public ctx: CanvasRenderingContext2D,
    public wheel_segments: number,
    public wheel_x: number,
    public wheel_y: number,
    public wheel_radius: number,
    items: Sprite[]
  ) {
    if (wheel_segments !== items.length) {
      throw new Error("The number of segments and items must be equal.");
    }
    this.wheel_rotation = 0;
    this.wheel_rotation_duration = 0; // in seconds
    this.wheel_rotation_speed = 0.1; // in degrees
    this.wheel_rotation_max_speed = 0;
    this.wheel_rotation_stop = 0;
    this.result_item = undefined;
    this.items = {};
    // TODO: Map each item to its own segment/rotation range

    for (let i = 0; i < this.wheel_segments; i++) {
      this.items[`segment${i + 1}`] = items[i];
    }
    console.log(this.items);

    this.spin(1, 10);
    // NOTE: To find the item on which the wheel has stopped you calculate
    // you divide the angle that you've got by angle range of each segment
    // and the segment is the max value of those divisions
    // 90 - 180 - 270 - 360
  }

  draw(dt: number) {
    drawTriangle(this.ctx, this.wheel_x, this.wheel_y - this.wheel_radius, 20);
    drawSegmentedCircle(this.ctx, this.wheel_segments, this.wheel_x, this.wheel_y, this.wheel_radius, this.wheel_rotation, this.items);
    // console.log("Wheel rotation in degrees: " + this.wheel_rotation * 180 / Math.PI);
  }

  spin(duration: number, speed: number) {
    this.result_item = undefined;
    // this.wheel_rotation = 0;
    this.wheel_rotation_stop = randomNumber(10, 20);
    this.wheel_rotation_duration = duration;
    this.wheel_rotation_max_speed = speed;
  }

  update(dt: number) {
    if (this.wheel_rotation < this.wheel_rotation_stop) {
      // Turn the wheel while it hasn't reached the stop point.
      // 
      // While we're not half way through the spin, 
      // increase the speed not surpassing the max speed 
      // 
      // Once we've passed the half way point of the spin
      // we start to decrease the speed also making sure that it's
      // not going below 0.
      //
      // calculate the exactly needed speed to be able to reach the
      // end of spinning smoothly with 60 frames / second

      this.wheel_rotation_speed += (0.2 * dt / 60); // render the speed 60 frames / second
      // TODO: Rewrite the spinning animation
      //
      console.log("Target rotation: " + this.wheel_rotation_stop);
      console.log("Current wheel rotation: " + this.wheel_rotation);
      console.log("Current wheel speed: " + this.wheel_rotation_speed);
      console.log();
      this.wheel_rotation += this.wheel_rotation_speed * dt / 60;
    }
    else if (!this.result_item) {
      console.log("Wheel rotation: " + radians_to_degrees(this.wheel_rotation));
      if (this.wheel_rotation < 0) {
        console.log("NOTE: Wheel rotation is negative...");
      }
      console.log();
      let segment_angle = degrees_to_radians(360 / this.wheel_segments);
      let current_segment_angle_range = segment_angle;

      let currentAngle;
      let closestItem;
      for (let i = 1; i <= this.wheel_segments; i++) {
        let newAngle = this.wheel_rotation / current_segment_angle_range;

        console.log("Segment item: ");
        console.log(this.items[`segment${i}`]);
        console.log("Segment angle range: " + radians_to_degrees(current_segment_angle_range));
        console.log("New angle: " + radians_to_degrees(newAngle));

        if (!currentAngle) {
          currentAngle = newAngle;
          closestItem = this.items[`segment${i}`];
          console.log("Changing closest Item: " + `segment${i}`);
        }
        else if (currentAngle < newAngle) {
          currentAngle = newAngle;
          closestItem = this.items[`segment${i}`];
          console.log("Changing closest Item: " + `segment${i}`);
        }
        console.log();

        current_segment_angle_range += segment_angle;
      }
      console.log("Closest item");
      console.log(closestItem);
      this.result_item = 5;
    }
    else {
      this.wheel_rotation_duration = 0;
    }

  }
}

class Sprite {
  img: HTMLImageElement;
  assets_loaded: boolean = false;

  constructor(
    public ctx: CanvasRenderingContext2D,
    public src: string,
    public x: number = 0,
    public y: number = 0
  ) {

    this.img = new Image();
    this.img.src = src;

    this.img.addEventListener("load", () => {
      this.assets_loaded = true;
    });
  }

  set(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  draw(): void {
    this.ctx.beginPath();
    if (this.assets_loaded) {
      this.ctx.drawImage(this.img, this.x, this.y, 50, 50);
    }
  }
}

class Button {

}

class Input {

}

class Label {

}

class Ghost extends Spawn {
  ghostImg: HTMLImageElement;
  assets_loaded: boolean = false;

  constructor(
    public name: string,
    public ctx: CanvasRenderingContext2D,
    public x: number = 0,
    public y: number = 0
  ) {
    super();

    this.ghostImg = new Image();
    this.ghostImg.src = "../images/ghost.png";

    this.ghostImg.addEventListener("load", () => {
      this.assets_loaded = true;
    });
  }
  set(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  draw(): void {
    this.ctx.beginPath();
    if (this.assets_loaded) {
      this.ctx.drawImage(this.ghostImg, this.x, this.y, 50, 50);
    }
  }

  move(dt: number, dx: number, dy: number) {
    this.x += (dx * dt);
    this.y += (dy * dt);
  }
}

class GameScene extends Scene {
  gameMap: GameMap;
  wheel: Wheel;
  swordIcon: Sprite;
  potionIcon: Sprite;
  ghostIcon: Sprite;
  warriorIcon: Sprite;

  constructor(ctx: CanvasRenderingContext2D) {
    super(ctx);
    this.swordIcon = new Sprite(this.ctx, "../images/sword.png", 0, 0);
    this.potionIcon = new Sprite(this.ctx, "../images/heal_potion.png", 0, 0);
    this.ghostIcon = new Sprite(this.ctx, "../images/ghost.png", 0, 0);
    this.warriorIcon = new Sprite(this.ctx, "../images/warrior.png", 0, 0);

    this.gameMap = new GameMap(this.ctx, window.innerWidth, window.innerHeight);
    this.wheel = new Wheel(
      this.ctx,
      4,
      300,
      300,
      100,
      [this.swordIcon, this.potionIcon, this.ghostIcon, this.warriorIcon]
    );
  }

  draw(dt: number): void {
    this.wheel.draw(dt);
    this.gameMap.draw();
  }

  update(dt: number): void {
    this.wheel.update(dt);

  }
}

// TODO: Set fixed 60 frames/second framerate
// https://www.kirupa.com/animations/ensuring_consistent_animation_speeds.htm
let gameScene = new GameScene(ctx);
let lastTime: number | null = null;

function render(currentTime: DOMHighResTimeStamp) {

  let deltaTime = currentTime - lastTime!;

  // Drawing here
  gameScene.clear();

  gameScene.draw(deltaTime);

  gameScene.update(deltaTime);

  requestAnimationFrame(render);

  lastTime = currentTime;

  // console.log("lastTime: " + lastTime);
  // console.log("deltaTime: " + deltaTime);
  // Updating here


}

function startRenderLoop(currentTime: DOMHighResTimeStamp) {
  lastTime = currentTime;
  requestAnimationFrame(render);
}

requestAnimationFrame(startRenderLoop); // Starting the main loop

