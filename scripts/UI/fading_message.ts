import { GameObject } from "@utils/game_object";
import { Label } from "./label";

export class FadingMessage extends Label implements GameObject {

  animation_triggered: boolean;
  animation_state: string;
  animation_timer: number;

  alpha: number;

  constructor(
    ctx: CanvasRenderingContext2D,
    text: string,
    public duration: number,
    x: number,
    y: number
  ) {
    super(ctx, "50px", "rgba(255, 255, 255, 0)", text, x, y, "center");

    this.alpha = 0;
    this.animation_timer = 0;
    this.animation_state = "inactive";
    this.animation_triggered = false;
  }

  draw(dt: number): void {
    this.ctx.beginPath();
    this.ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
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

  updatePlaceholder(new_placeholder: string) {
    if (!this.animation_triggered) {
      this.placeholder = new_placeholder;
    }
  }

  startAnimation() {
    if (!this.animation_triggered) {
      this.animation_state = "fade_out";
      this.animation_triggered = true;
    }
  }

  // onUpdate: (dt: number) => void = (dt: number) => { }

  update(dt: number): void {
    // this.onUpdate(dt);
    if (this.animation_state == "fade_out") {
      if (this.alpha < 1) {
        this.alpha += 1 / 30 * dt / 60;
      }
      else {
        this.animation_state = "wait";
      }
    }
    else if (this.animation_state == "wait") {
      if (this.animation_timer < this.duration) {
        this.animation_timer += 1 / 30 * dt / 60;
      }
      else {
        this.animation_state = "fade_in";
      }
    }
    else if (this.animation_state == "fade_in") {
      if (this.alpha > 0) {
        this.alpha -= 1 / 30 * dt / 60;
      }
      else {
        this.animation_state = "inactive";
        this.animation_triggered = false;
      }
    }

  }
}
