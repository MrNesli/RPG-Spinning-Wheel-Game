import { GameObject } from "@utils/game_object";
import { Screen } from "@utils/screen";
import { Sprite } from "@utils/sprite";

export class WheelIcon extends GameObject {
  width: number;
  height: number;
  real_x: number;
  real_y: number;

  constructor(
    ctx: CanvasRenderingContext2D,
    public label: string,
    public src: string,
    x: number,
    y: number
  ) {
    super(ctx, src, x, y);
    this.width = 45;
    this.height = 50;
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
      // let icon_width = Screen.width_percent * 5;
      // let icon_height = Screen.height_percent * 12;
      let icon_width = this.width;
      let icon_height = this.height;

      if (Screen.width < 900) {
        icon_width = this.width - 5;
        icon_height = this.height - 5;
      }
      if (Screen.width < 700) {
        icon_width = this.width - 10;
        icon_height = this.height - 10;
      }
      if (Screen.width < 600) {
        icon_width = this.width - 20;
        icon_height = this.height - 20;
      }
      if (Screen.width < 500) {
        icon_width = this.width - 25;
        icon_height = this.height - 25;
      }
      if (Screen.width < 400) {
        icon_width = this.width - 30;
        icon_height = this.height - 30;
      }
      // if (Screen.width < 1000) {
      //   icon_width = Screen.height_percent * 12;
      // }
      // if (Screen.width < 800) {
      //   icon_width = Screen.height_percent * 10;
      // }
      // if (Screen.width < 600) {
      //   icon_width = Screen.height_percent * 9;
      // }
      // else {
      //   icon_width = Screen.height_percent * 5;
      // }

      // if (Screen.height <= 350) {
      //   icon_height = Screen.width_percent * 5;
      // }
      // else {
      //   icon_height = Screen.width_percent * 5;
      // }
      this.ctx.drawImage(this.img as HTMLImageElement, this.x, this.y, icon_width, icon_height); // Width: 5% of the screen size, Height: 5%
    }
  }
  update(dt: number): void { }
}
