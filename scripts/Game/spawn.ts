import { GameObject } from '@utils/game_object'
import { Sprite } from '@utils/sprite'
import { AnimationFrame } from './animation_frame';

export class Spawn extends Sprite implements GameObject {
  animation_timer: number;
  frame_duration: number;
  animation_frames: AnimationFrame[];
  current_animation_frame: AnimationFrame | undefined;
  current_animation_frame_index: number;

  animation_state: string;

  width: number;
  height: number;
  init_x: number;
  init_y: number;
  velocity_x: number;
  velocity_y: number;
  damage: number;
  hp: number;
  max_hp: number;
  target: Spawn | undefined;
  offset_x_from_target: number;

  constructor(
    public ctx: CanvasRenderingContext2D,
    public spawn_type: string,
    public x: number = 0,
    public y: number = 0
  ) {

    let image_src;
    if (spawn_type === "Warrior") {
      image_src = "../images/warrior.png";
    }
    else if (spawn_type === "Ghost") {
      image_src = "../images/ghost.png";
    }
    else {
      throw new Error(`${spawn_type} is not supported!`);
    }

    super(ctx, image_src, x, y);

    this.animation_state = "idle";
    this.damage = 10;
    this.max_hp = 10;
    this.hp = this.max_hp;
    this.velocity_x = 0;
    this.velocity_y = 0;
    this.width = 45;
    this.height = 50;
    this.init_x = x;
    this.init_y = y;
    this.target = undefined;
    this.offset_x_from_target = 0;

    this.animation_frames = [];
    this.current_animation_frame_index = 0;
    this.current_animation_frame = undefined;
    this.animation_timer = 0;
    this.frame_duration = 300;
  }
  set(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.init_x = x;
    this.init_y = y;
  }

  update(dt: number) {
    this.attackAnimation(dt);
  }

  draw(dt: number): void {
    this.ctx.beginPath();
    if (this.assets_loaded) {
      if (this.current_animation_frame) {
        this.current_animation_frame.draw(dt);
      }

      this.ctx.globalCompositeOperation = "destination-over";
      this.ctx.drawImage(this.img, this.x, this.y, 45, 50);
      this.ctx.globalCompositeOperation = "source-over";
    }
  }

  getSlashAnimationFrames(slash_type: string) {
    let animation_frames_length = 10;
    let animation_frames = [];
    for (let i = 1; i <= animation_frames_length; i++) {
      let num = i < 10 ? `0${i}` : `${i}`;
      let frame = new AnimationFrame(this.ctx, `../../images/${slash_type}/${num}.png`, 0, 0);
      animation_frames.push(frame);
    }
    console.log(animation_frames);
    return animation_frames;
  }

  attackAnimation(dt: number) {
    // move_to; slash; move_back
    if (this.target) {
      if (this.animation_state == "move_to") {
        if (this.spawn_type === "Warrior") {
          if (!this.canMoveTo(dt, this.target.x - 60, this.target.y, 10, 3)) {
            this.animation_state = "slash";
            this.animation_frames = this.getSlashAnimationFrames("slash");
            this.offset_x_from_target = 100;
            this.current_animation_frame = this.animation_frames[this.current_animation_frame_index];
          }
        }
        else if (this.spawn_type === "Ghost") {
          if (!this.canMoveTo(dt, this.target.x + 60, this.target.y, 10, 3)) {
            this.animation_state = "slash";
            this.animation_frames = this.getSlashAnimationFrames("reversed_slash");
            this.offset_x_from_target = 100;
            this.current_animation_frame = this.animation_frames[this.current_animation_frame_index];
          }
        }
      }
      else if (this.animation_state == "slash") {
        this.slashAnimation(dt);
      }
      else if (this.animation_state == "move_back") {
        if (!this.canMoveTo(dt, this.init_x, this.init_y, 10, 5)) {
          this.animation_state = "idle";
        }
      }
    }
  }

  slashAnimation(dt: number) {
    if (this.current_animation_frame_index < this.animation_frames.length - 1) {
      if (this.animation_timer < this.frame_duration) {
        this.animation_timer += 325 * dt / 60;
        console.log("Animation timer: " + this.animation_timer);
      }
      else {
        this.nextAnimationFrame(
          this.target!.x - this.offset_x_from_target,
          this.target!.y - 60
        );
        // console.log(`TARGET XY: ${this.target!.x - this.offset_x_from_target} ${this.target!.y - 50}`)
      }
    }
    else {
      this.resetAnimationFrame();
      this.animation_state = "move_back";
      this.target!.hp -= this.damage;
    }
  }

  resetAnimationFrame() {
    this.animation_timer = 0;
    this.current_animation_frame_index = 0;
    this.current_animation_frame = undefined;
  }

  nextAnimationFrame(x: number, y: number) {
    this.current_animation_frame_index += 1;
    this.current_animation_frame = this.animation_frames[this.current_animation_frame_index];
    this.current_animation_frame.x = x;
    this.current_animation_frame.y = y;
    this.animation_timer = 0;
  }

  attack(spawn: Spawn) {
    this.target = spawn;
    this.animation_state = "move_to";
  }

  canMoveTo(dt: number, x: number, y: number, speed_x: number, speed_y: number): boolean {
    let canMove = false;
    if (this.x > x) {
      this.x -= speed_x * dt / 60;
      if (this.x <= x)
        this.x = x;
      canMove = true;
    }
    else if (this.x < x) {
      this.x += speed_x * dt / 60;
      if (this.x >= x)
        this.x = x;
      canMove = true;
    }

    if (this.y > y) {
      this.y -= speed_y * dt / 60;
      if (this.y <= y)
        this.y = y;
      canMove = true;
    }
    else if (this.y < y) {
      this.y += speed_y * dt / 60;
      if (this.y >= y)
        this.y = y;
      canMove = true;
    }

    return canMove;
  }

  move(dx?: number, dy?: number) {
    if (dx) {
      this.velocity_x = dx;
    }
    if (dy) {
      this.velocity_y = dy;
    }
  }
}
