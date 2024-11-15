import { Wheel } from "./wheel";
import { Player } from "./player";
import { Point } from "./point";

// Class that describes the logic of the game
export class Game {
  // Player 1 group of spawns
  // Player 2 group of spawns
  // Reference to the wheel
  // Who's turn
  // Exectue different actions: Actions.attack(player1, player2), Actions.heal(player)
  // Animations for those actions... Attack animation: When the attack action has been chosen
  //

  warrior_group_pos: Point = { x: 450, y: 400 };
  ghost_group_pos: Point = { x: 850, y: 400 };

  player_1: Player;
  player_2: Player;

  constructor(
    public ctx: CanvasRenderingContext2D,
    public game_wheel: Wheel,
  ) {

    this.player_1 = new Player(1, this.ctx, 3, "Ghost", this.ghost_group_pos);
    this.player_2 = new Player(2, this.ctx, 3, "Warrior", this.warrior_group_pos);
  }
}
