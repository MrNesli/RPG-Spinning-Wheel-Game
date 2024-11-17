import { Player } from "@game/player";
import { Label } from "./label";
import { GameObject } from "@utils/game_object";

export class PlayerHPLabel extends Label implements GameObject {
  constructor(
    public player: Player,
    public ctx: CanvasRenderingContext2D,
    public x: number,
    public y: number
  ) {
    super(ctx, "30px", "#7fff00", "", x, y);
  }

  draw(dt: number): void {
    super.draw(dt);
  }

  update(dt: number): void {
    if (this.player.hp <= this.player.max_hp / 2) {
      this.color = "#f59f00";
    }
    else {
      this.color = "#7fff00";

    }
    this.placeholder = `${this.player.hp}/${this.player.max_hp}`;

  }
}
