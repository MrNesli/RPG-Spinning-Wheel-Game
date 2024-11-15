import { GameObject } from './game_object'
import { Sprite } from './sprite'
// interface Spawn {
//
// }

export type Spawn = Ghost | Warrior;

export class Ghost extends Sprite implements GameObject {
  velocity_x: number;
  velocity_y: number;
  hp: number;

  constructor(
    public ctx: CanvasRenderingContext2D,
    public x: number = 0,
    public y: number = 0
  ) {
    super(ctx, "../images/ghost.png", x, y);
    this.hp = 10;
    this.velocity_x = 0;
    this.velocity_y = 0;

  }
  set(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  update(dt: number) {
    this.x += this.velocity_x * dt / 60;
    this.y += this.velocity_y * dt / 60;
  }

  draw(dt: number): void {
    this.ctx.beginPath();
    if (this.assets_loaded) {
      this.ctx.drawImage(this.img, this.x, this.y, 50, 50);
    }
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

export class Warrior extends Sprite implements GameObject {
  velocity_x: number;
  velocity_y: number;
  hp: number;

  constructor(
    public ctx: CanvasRenderingContext2D,
    public x: number = 0,
    public y: number = 0
  ) {
    super(ctx, "../images/warrior.png", x, y);
    this.hp = 10;
    this.velocity_x = 0;
    this.velocity_y = 0;

  }
  set(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  update(dt: number) {
    this.x += this.velocity_x * dt / 60;
    this.y += this.velocity_y * dt / 60;
  }

  draw(dt: number): void {
    this.ctx.beginPath();
    if (this.assets_loaded) {
      this.ctx.drawImage(this.img, this.x, this.y, 45, 50);
    }
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
