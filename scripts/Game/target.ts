import { GameEvents } from "@events/events";
import { GameObject } from "@utils/game_object";
import { Sprite } from "@utils/sprite";
import { Player } from "./player";
import { Screen } from "@utils/screen";


export class Target extends GameObject {
  // "zoom in" "zoom out"

  active: boolean;

  animation_state: string;

  // bound_width: number;
  // bound_height: number;

  width: number;
  height: number;
  scale: number;
  min_scale: number;
  max_scale: number;

  constructor(
    ctx: CanvasRenderingContext2D,
    public spawn_id: number,
    public player: Player
    // x: number,
    // y: number
  ) {
    // Try to resolve the path with @images/target.png
    super(ctx, "../../images/target.png", player.spawns[spawn_id].x, player.spawns[spawn_id].y);

    this.active = false;
    this.animation_state = "idle";

    this.width = 45;
    this.height = 50;
    // let spawn_width = Screen.width_percent * 4 + 2;
    // let spawn_height = Screen.width_percent * 5;
    this.scale = 1;
    this.min_scale = 1.35;
    this.max_scale = 1.55;

    // this.bound_width = 40;
    // this.bound_height = 40;

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
    // if (this.active) {
    this.ctx.beginPath();
    if (this.assets_loaded) {
      let target_width = this.width;
      let target_height = this.height;
      if (Screen.width < 900) {
        target_width = this.width - 5;
        target_height = this.height - 5;
      }
      if (Screen.width < 700) {
        target_width = this.width - 10;
        target_height = this.height - 10;
      }
      if (Screen.width < 600) {
        target_width = this.width - 20;
        target_height = this.height - 20;
      }
      if (Screen.width < 500) {
        target_width = this.width - 25;
        target_height = this.height - 25;
      }
      if (Screen.width < 400) {
        target_width = this.width - 30;
        target_height = this.height - 30;
      }

      let offset_x = target_width;
      let offset_y = target_height;
      //https://stackoverflow.com/questions/33311856/keep-the-image-centred-after-scaling
      let scaled_x = (this.x * 2 + offset_x - this.width * this.scale) * 0.5; // -60 * 0.5 = -30
      let scaled_y = (this.y * 2 + offset_y - this.height * this.scale) * 0.5;
      // console.log("Scaled X" + scaled_x);
      // console.log("Scaled Y" + scaled_y);
      this.ctx.drawImage(this.img as HTMLImageElement, scaled_x, scaled_y, this.width * this.scale, this.height * this.scale);
    }
    // }
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

  attachToSpawn() {
    this.x = this.player.spawns[this.spawn_id].x;
    this.y = this.player.spawns[this.spawn_id].y;
  }

  update(dt: number): void {
    this.attachToSpawn();

    // if (this.active) {
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
  // }
}
