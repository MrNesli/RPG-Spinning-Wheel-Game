import { Wheel } from "@game/wheel";
import { GameObject } from "@utils/game_object";
import { drawArc } from "@utils/funcs";
import { Player } from "@game/player";

export class Label extends GameObject {
  label: string;
  wheel: Wheel | undefined;
  player: Player | undefined;

  constructor(
    ctx: CanvasRenderingContext2D,
    public font_size: string,
    public color: string,
    public placeholder: string,
    x: number,
    y: number,
    public align: "left" | "right" | "center" = "left"

  ) {
    super(ctx, null, x, y);
    this.label = "";
    this.wheel = undefined;
    this.player = undefined;
  }

  draw(dt: number) {
    this.ctx.beginPath();
    this.ctx.fillStyle = `${this.color}`;
    this.ctx.textAlign = this.align;
    this.ctx.font = `${this.font_size} Arial`;
    // drawArc(this.ctx, this.x, this.y, 5, 0, Math.PI * 2);
    this.ctx.fillText(
      this.placeholder + this.label,
      this.x,// + this.ctx.measureText(this.label).width,
      this.y
    );
    this.ctx.font = "10px Arial";
  }

  setLabel(label: string) {
    this.label = label;
  }

  setPlayerLabel(player: Player) {
    this.player = player;
  }

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
