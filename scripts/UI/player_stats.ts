import { Player } from "@game/player";
import { GameObject } from "@utils/game_object";
import { HealthBar } from "./health_bar";
import { PlayerHPLabel } from "./player_label";
import { Label } from "./label";

export class PlayerStats implements GameObject {
  health_bar: HealthBar;
  hp_label: PlayerHPLabel;
  nickname_label: Label;

  constructor(
    public ctx: CanvasRenderingContext2D,
    public player: Player,
    public x: number,
    public y: number
  ) {
    this.health_bar = new HealthBar(player, this.ctx, 125, 25, x + 100, y + 60);
    this.hp_label = new PlayerHPLabel(player, this.ctx, x + 20, y + 84);
    this.nickname_label = new Label(this.ctx, "20px", "white", player.nickname, x + 115, y + 40, "center")
    // this.player_1_label = new Label(this.ctx, "20px", "white", "You:", 100, 40);
    // this.player_2_label = new Label(this.ctx, "20px", "white", "Enemy:", 1010, 40);
    // this.player_1_healthbar = new HealthBar(this.player_1, this.ctx, 100, 25, 100, 60);
    // this.player_2_healthbar = new HealthBar(this.player_2, this.ctx, 100, 25, 1000, 60);
    // this.player_1_healthlabel = new PlayerHPLabel(this.player_1, this.ctx, 45, 84);
    // this.player_2_healthlabel = new PlayerHPLabel(this.player_2, this.ctx, 950, 84);
  }

  draw(dt: number) {
    this.health_bar.draw(dt);
    this.hp_label.draw(dt);
    this.nickname_label.draw(dt);
  }

  update(dt: number) {
    this.health_bar.update(dt);
    this.hp_label.update(dt);
    this.nickname_label.update(dt);
  }
}
