const canvas: HTMLCanvasElement = document.getElementById("game-window") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");
const colors = ["orange", "red", "blue", "yellow"];

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

function drawSegmentedCircle(
  ctx: CanvasRenderingContext2D,
  number_of_segments: number,
  x: number,
  y: number,
  radius: number,
  rotation: number,
  items: Ghost[]
) {
  if (number_of_segments !== items.length) {
    throw new Error("The number of segments and items must be equal.");
  }

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.translate(-x, -y);
  let segment_angle = (Math.PI * 2) / number_of_segments; // single segment angle
  for (let segment = 1; segment <= number_of_segments; segment++) {
    let angle_start = ((segment - 1) * segment_angle);
    let angle_end = segment * segment_angle;

    drawArc(ctx, x, y, radius, angle_start, angle_end, true);

    // let radius_center_x = x + radius * Math.cos((angle_end - angle_start) * (segment - 0.5));
    // let radius_center_x = x + radius * Math.cos((angle_end - angle_start) * (segment - 0.5));

    let radius_center_x = x + radius / 2 * Math.cos(angle_end);
    let radius_center_y = y + radius / 2 * Math.sin(angle_end);

    // console.log(`Radius center x${segment}: ` + radius_center_x);
    // console.log(`Radius center y${segment}: ` + radius_center_y);

    // TODO: When the wheel size is too big for items, you need to offset radius_center positions
    // Use size 400 to see what I mean

    // Item coordinate point for visual understanding
    drawArc(ctx, radius_center_x, radius_center_y, 9, 0, Math.PI * 2, false, colors[segment - 1]);

    ctx.save(); // saving the state of the context
    ctx.translate(radius_center_x, radius_center_y);

    // Calculating rotation angle to align the item in its own segment
    // We have to multiply the rotation by -1 if the segment isn't pair 
    // because the circle rotates in the clockwise direction
    ctx.rotate(angle_end / (Math.pow(-1, segment) * (segment * 2) * (segment % 2 === 0 ? 1.5 : 0.75)) + (segment > 2 ? Math.PI : 0));
    ctx.translate(-radius_center_x, -radius_center_y);

    items[segment - 1].set(radius_center_x, radius_center_y);
    items[segment - 1].draw();

    ctx.restore(); // restoring the state of the context
  }

  drawArc(ctx, x, y, radius, 0, Math.PI * 2); // a circle

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

class Wheel {
  wheel_rotation: number;
  wheel_rotation_speed: number;
  items: Ghost[];

  constructor(public ctx: CanvasRenderingContext2D) {
    this.wheel_rotation = 0;
    this.wheel_rotation_speed = 0;
    this.items = [];
    for (let i = 0; i < 4; i++) {
      let ghost = new Ghost(
        `ghost${i}`,
        ctx
      );
      this.items.push(ghost);
    }

    // this.spin();

  }

  draw(dt: number) {
    drawSegmentedCircle(this.ctx, 4, 200, 200, 150, this.wheel_rotation, this.items);
  }

  spin() {
    this.wheel_rotation_speed = 6;
  }

  update(dt: number) {
    if (this.wheel_rotation_speed > 0) {
      this.wheel_rotation_speed -= (0.2 / dt);
    }
    else {
      this.wheel_rotation_speed = 0;
    }

    this.wheel_rotation -= ((Math.PI / 180) * (10 * this.wheel_rotation_speed)) / dt;
  }
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
    // else {
    //   throw new Error("Failed to load ghost image.");
    // }
  }

  move(dt: number, dx: number, dy: number) {
    this.x += (dx * dt);
    this.y += (dy * dt);
  }

  // update() {
  //
  // }

}

class GameScene extends Scene {
  gameMap: GameMap;
  wheel: Wheel;
  ghost: Ghost;

  constructor(ctx: CanvasRenderingContext2D) {
    super(ctx);
    this.gameMap = new GameMap(this.ctx, window.innerWidth, window.innerHeight);
    this.wheel = new Wheel(this.ctx);
    this.ghost = new Ghost("ghost1", this.ctx, 125, 125);
  }

  draw(dt: number): void {
    // console.log("Drawing Game Scene...");
    this.ghost.draw();
    this.wheel.draw(dt);
    this.gameMap.draw();
  }

  update(dt: number): void {
    // console.log("Updating Game Scene...");
    this.ghost.move(dt, -0.1, 0);
    this.wheel.update(dt);

  }

  // render() {
  // }
}


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

