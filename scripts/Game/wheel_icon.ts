import { Sprite } from "@utils/sprite";

export class WheelIcon extends Sprite {
  real_x: number;
  real_y: number;

  constructor(
    public ctx: CanvasRenderingContext2D,
    public label: string,
    public src: string,
    public x: number,
    public y: number
  ) {
    super(ctx, src, x, y);
    this.real_x = x;
    this.real_y = y;
  }

  set(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  setReal(x: number, y: number) {
    this.real_x = x;
    this.real_y = y;
  }

  draw(): void {
    this.ctx.beginPath();
    if (this.assets_loaded) {
      this.ctx.drawImage(this.img, this.x, this.y, 50, 50);
    }
  }

  update(dt: number): void { }
}
