import { Player } from "@game/player";
import { GameObject } from "@utils/game_object";
import { Screen } from "@utils/screen";

export class HealthBar extends GameObject {
  health_percent: number;
  width_percent: number;

  constructor(
    public player: Player,
    ctx: CanvasRenderingContext2D,
    public width: number,
    public height: number,
    x: number,
    y: number
  ) {
    super(ctx, null, x, y);
    this.health_percent = this.player.max_hp / 100;
    this.width_percent = this.width / 100;
  }

  draw(dt: number) {
    // console.log("Drawing healthbar");
    this.ctx.beginPath();
    this.ctx.fillStyle = "red";
    // console.log("Player's hp: " + this.player.hp);
    // console.log("Health percent: " + this.health_percent);
    // console.log("Width percent: " + Screen.width_percent);
    this.ctx.roundRect(this.x, this.y, this.player.hp / this.health_percent * this.width_percent, this.height, 5);
    this.ctx.fill();
    this.ctx.fillStyle = "gray";
    this.ctx.roundRect(this.x, this.y, this.width, this.height, 5);
    this.ctx.fill();
  }

  update(dt: number) {

  }
}
