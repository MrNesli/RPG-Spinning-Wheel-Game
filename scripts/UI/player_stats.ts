import { Player } from "@game/player";
import { GameObject } from "@utils/game_object";
import { HealthBar } from "./health_bar";
import { PlayerHPLabel } from "./player_label";
import { Label } from "./label";
import { Screen } from "@utils/screen";

export class PlayerStats extends GameObject {
  health_bar: HealthBar;
  hp_label: PlayerHPLabel;
  nickname_label: Label;

  constructor(
    ctx: CanvasRenderingContext2D,
    public player: Player,
    x: number,
    y: number
  ) {
    super(ctx, null, x, y);
    this.health_bar = new HealthBar(player, this.ctx, 125, 25, x + 100, y + 60);
    this.hp_label = new PlayerHPLabel(player, this.ctx, "30px", x + 20, y + 84);
    this.nickname_label = new Label(this.ctx, "20px", "white", player.nickname, x + 115, y + 40, "center");
  }

  draw(dt: number) {
    this.health_bar.draw(dt);
    this.hp_label.draw(dt);
    this.nickname_label.draw(dt);
  }

  responsive() {
    if (Screen.width >= 900) {
      this.health_bar.height = 25;
      this.hp_label.font_size = "30px";
      this.nickname_label.font_size = "20px";
    }
    if (Screen.width < 900) {
      this.health_bar.height = 20;
      this.hp_label.font_size = "25px";
      this.hp_label.y = this.y + 79;
      this.nickname_label.font_size = "15px";
    }
  }

  update(dt: number) {
    this.responsive();
    this.health_bar.update(dt);
    this.hp_label.update(dt);
    this.nickname_label.update(dt);
  }
}
