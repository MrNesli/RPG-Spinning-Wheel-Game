export class GameMap {
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