import { Wheel } from "@game/wheel";
import { GameObject } from "@utils/game_object";
import { drawArc } from "@utils/funcs";

export class Label implements GameObject {
  label: string;
  wheel: Wheel | undefined;

  constructor(
    public ctx: CanvasRenderingContext2D,
    public placeholder: string,
    public x: number,
    public y: number
  ) {
    this.label = "";
    this.wheel = undefined;
  }

  draw(dt: number) {
    this.ctx.beginPath();
    this.ctx.fillStyle = "white";
    this.ctx.textAlign = "center"
    this.ctx.font = "40px Arial";
    drawArc(this.ctx, this.x, this.y, 5, 0, Math.PI * 2);
    this.ctx.fillText(
      this.placeholder + this.label,
      this.x,// + this.ctx.measureText(this.label).width,
      this.y
    );
    this.ctx.font = "10px Arial";
  }

  // setLabel(label: string) {
  //   this.label = label;
  // }

  setWheelLabel(wheel: Wheel) {
    this.wheel = wheel;
  }

  update(dt: number) {
    if (this.wheel) {
      if (this.wheel.result_item) {
        this.label = this.wheel.result_item.label;
      }
    }

  }

}
