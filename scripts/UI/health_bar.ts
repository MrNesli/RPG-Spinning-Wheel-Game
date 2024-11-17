import { Player } from "@game/player";
import { GameObject } from "@utils/game_object";

export class HealthBar implements GameObject {
  width_point: number;
  health_point: number;

  constructor(
    public player: Player,
    public ctx: CanvasRenderingContext2D,
    public width: number,
    public height: number,
    public x: number,
    public y: number
  ) {
    this.width_point = this.width / 100;
    this.health_point = this.player.max_hp / 100;
  }

  draw(dt: number) {
    console.log("Drawing healthbar");
    this.ctx.beginPath();
    this.ctx.fillStyle = "red";
    this.ctx.roundRect(this.x, this.y, this.player.hp / this.health_point * this.width_point, this.height, 5);
    this.ctx.fill();
    this.ctx.fillStyle = "gray";
    this.ctx.roundRect(this.x, this.y, this.width, this.height, 5);
    this.ctx.fill();
  }

  update(dt: number) {

  }
}
