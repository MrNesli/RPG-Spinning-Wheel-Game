import { Screen } from "@utils/screen";
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
    //
    this.ctx.beginPath();
    if (this.assets_loaded) {
      let icon_width = Screen.width_percent * 5;
      let icon_height = Screen.height_percent * 15;
      if (Screen.width < 800) {
        icon_height = Screen.height_percent * 12;
      }
      if (Screen.width < 600) {
        icon_height = Screen.height_percent * 9;
      }

      if (Screen.height <= 350) {
        icon_height = Screen.width_percent * 5;
      }
      // else {
      //   icon_height = Screen.width_percent * 5;
      // }
      this.ctx.drawImage(this.img, this.x, this.y, icon_width, icon_height); // Width: 5% of the screen size, Height: 5%
    }
  }
  update(dt: number): void { }
}
