const canvas: HTMLCanvasElement = document.getElementById("game-window") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

if (!ctx) {
  throw new Error("Couldn't get the context.");
}

ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;

function drawCircle(ctx: CanvasRenderingContext2D) {
  ctx.beginPath();
  ctx.fillStyle = "black";
  ctx.arc(400, 100, 50, 0, Math.PI * 2);
  ctx.fill();
}

function drawSegment(ctx: CanvasRenderingContext2D) {
  ctx.beginPath();
  ctx.fillStyle = "black";
  ctx.arc(400, 100, 50, 0, Math.PI * 2);
  ctx.fill();
}

abstract class Scene {
  constructor(
    public ctx: CanvasRenderingContext2D
  ) {
  }

  abstract draw(): void;
  abstract update(): void;

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }
}

class NicknameInputScene extends Scene {
  constructor(ctx: CanvasRenderingContext2D) {
    super(ctx);
  }

  draw(): void {
    this.ctx.fillStyle = "green";
    console.log("Nickname Input Scene...");
    this.ctx.fillRect(50, 50, 15, 15);
  }

  update(): void {

  }
}

class GameMap {
  constructor(
    public ctx: CanvasRenderingContext2D,
    public width: number = 200,
    public height: number = 200
  ) { }

  draw(src: string = "../images/tile.png") {
    let tile = new Image();
    tile.src = src;
    tile.addEventListener("load", (e) => {
      const pattern = this.ctx.createPattern(tile, "repeat") as CanvasPattern;
      this.ctx.globalCompositeOperation = 'destination-over'; // Draw the map on the background
      this.ctx.rect(0, 0, this.width, this.height);
      this.ctx.fillStyle = pattern;
      this.ctx.fill();
    });
  }

}

abstract class Spawn {
  abstract draw(x: number, y: number): void;
}

class Wheel {

  constructor(public ctx: CanvasRenderingContext2D) { }

  drawCircle() {
    this.ctx.beginPath();
    this.ctx.fillStyle = "black";
    // this.ctx.moveTo(400, 100);
    this.ctx.arc(400, 100, 50, 0, Math.PI * 2);
    this.ctx.fill();
    this.draw();
  }

  draw() {

    this.ctx.beginPath();
    this.ctx.moveTo(400, 100);
    // this.ctx.globalCompositeOperation = 'destination-over';
    this.ctx.fillStyle = "red";
    this.ctx.arc(400, 100, 50, 0, Math.PI / 2, false);
    this.ctx.fill();
  }
}

class Ghost extends Spawn {
  constructor(
    public name: string,
    public ctx: CanvasRenderingContext2D
  ) {
    super();
  }

  draw(x: number, y: number): void {
    let ghostImg = new Image();
    this.ctx.beginPath();
    ghostImg.src = "../images/ghost.png";
    ghostImg.addEventListener("load", (e) => {
      this.ctx.drawImage(ghostImg, x, y, 50, 50);
    });
  }
}

class GameScene extends Scene {
  constructor(ctx: CanvasRenderingContext2D) {
    super(ctx);
  }

  draw(): void {
    console.log("Drawing Game Scene...");
    let ghost = new Ghost("ghost1", this.ctx);
    let gameMap = new GameMap(this.ctx, window.innerWidth, window.innerHeight);
    let wheel = new Wheel(this.ctx);
    wheel.drawCircle();
    gameMap.draw();
    ghost.draw(125, 125);
  }

  update(): void {
    console.log("Updating Game Scene...");
  }
}

let gameScene = new GameScene(ctx);
gameScene.draw();
