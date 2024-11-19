import { Player } from "@game/player";
import { Label } from "./label";
import { GameObject } from "@utils/game_object";

// TODO: Rename this file
export class PlayerHPLabel extends Label {
  constructor(
    public player: Player,
    public ctx: CanvasRenderingContext2D,
    public font_size: string,
    public x: number,
    public y: number
  ) {
    super(ctx, font_size, "#7fff00", "", x, y);
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
