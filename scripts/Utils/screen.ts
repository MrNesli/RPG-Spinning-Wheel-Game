export class Screen {
  static width: number = 0;
  static height: number = 0;
  static width_percent: number = 0;
  static height_percent: number = 0;

  static updateSizeProportions(ctx: CanvasRenderingContext2D) {
    this.width = ctx.canvas.width;
    this.height = ctx.canvas.height;
    this.width_percent = Math.floor(this.width / 100);
    this.height_percent = Math.floor(this.height / 100);
  }
}
