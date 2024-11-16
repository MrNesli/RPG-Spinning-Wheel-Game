import { Sprite } from "@utils/sprite";

export class AnimationFrame extends Sprite {
  constructor(
    ctx: CanvasRenderingContext2D,
    src: string,
    x: number,
    y: number,
  ) {
    super(ctx, src, x, y);
  }

  draw(dt: number): void {
    if (this.assets_loaded) {
      this.ctx.drawImage(this.img, this.x, this.y);
    }
  }

  update(dt: number): void { }
}
