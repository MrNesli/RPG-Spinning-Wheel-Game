import { GameEvents } from "@events/events";
import { GameObject } from "@utils/game_object";
import { Sprite } from "@utils/sprite";


export class Target extends Sprite implements GameObject {
  // "zoom in" "zoom out"

  active: boolean;

  animation_state: string;

  bound_width: number;
  bound_height: number;

  width: number;
  height: number;
  scale: number;
  min_scale: number;
  max_scale: number;

  constructor(
    ctx: CanvasRenderingContext2D,
    public spawn_id: number,
    x: number,
    y: number
  ) {
    // Try to resolve the path with @images/target.png
    super(ctx, "../../images/target.png", x, y);

    this.active = false;
    this.animation_state = "idle";

    this.width = 40;
    this.height = 40;
    this.scale = 1;
    this.min_scale = 1.35;
    this.max_scale = 1.75;

    this.bound_width = 40
    this.bound_height = 40;

  }

  activate() {
    this.active = true;
    this.startZoomAnimation();
  }

  deactivate() {
    this.active = false;
  }

  startZoomAnimation() {
    if (this.animation_state == "idle") {
      this.animation_state = "zoom_out";
    }
  }

  pauseZoomAnimation() {
    this.animation_state = "zoom_in_idle";
  }

  draw(dt: number): void {
    if (this.active) {
      this.ctx.beginPath();
      if (this.assets_loaded) {
        //https://stackoverflow.com/questions/33311856/keep-the-image-centred-after-scaling
        let scaled_x = (this.x * 2 + 50 - this.width * this.scale) * 0.5; // -60 * 0.5 = -30
        let scaled_y = (this.y * 2 + 50 - this.height * this.scale) * 0.5;
        // console.log("Scaled X" + scaled_x);
        // console.log("Scaled Y" + scaled_y);
        this.ctx.drawImage(this.img, scaled_x, scaled_y, this.width * this.scale, this.height * this.scale);
      }
    }
  }

  mouseInside(): boolean {
    if (GameEvents.mouse_x >= this.x &&
      GameEvents.mouse_x <= this.x + this.width &&
      GameEvents.mouse_y >= this.y &&
      GameEvents.mouse_y <= this.y + this.height) {
      return true;
    }
    return false;
  }

  onClick: () => void = () => {
    console.log("Target clicked!");
  }


  togglingZoomAnimation(dt: number) {
    if (this.animation_state == "zoom_out") {
      if (this.scale < this.max_scale) {
        // Increases the scale by 1 each second
        this.scale += 1 / 60 * dt / 60;
      }
      else {
        this.animation_state = "zoom_in";
      }
    }
    else if (this.animation_state == "zoom_in") {
      if (this.scale > this.min_scale) {
        // Decreases the scale by 1 each second
        this.scale -= 1 / 60 * dt / 60;
      }
      else {
        this.animation_state = "zoom_out";
      }
    }
    else if (this.animation_state == "zoom_in_idle") {
      if (this.scale > this.min_scale) {
        // Decreases the scale by 1 each second
        this.scale -= 1 / 60 * dt / 60;
      }
      else {
        this.animation_state = "idle";
      }
    }
  }

  update(dt: number): void {
    if (this.active) {
      if (this.mouseInside()) {
        this.pauseZoomAnimation();
        // console.log("Mouse position target: " + GameEvents.mouseX + " " + GameEvents.mouseY);
        if (GameEvents.clicked) {
          // this.width = 0;
          // this.height = 0;
          this.onClick();
          GameEvents.clicked = false;
        }
      }
      else {
        this.startZoomAnimation();
      }

      this.togglingZoomAnimation(dt);
    }
  }
}
