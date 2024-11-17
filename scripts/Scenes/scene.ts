import { GameMap } from "@game/game_map";
import { randomNumber } from "@utils/funcs";
import { Button } from "@UI/button";
import { Label } from "@UI/label";
import { Game } from "@game/game";

abstract class Scene {
  constructor(public ctx: CanvasRenderingContext2D) { }

  abstract draw(dt: number): void;
  abstract update(dt: number): void;

  clear() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }
}

export class GameScene extends Scene {
  // action_label: Label;

  game: Game;
  gameMap: GameMap;
  button: Button;

  constructor(ctx: CanvasRenderingContext2D) {
    super(ctx);

    // TODO: Maybe move the wheel to the Game class so that we call just a few functions
    // like: Game.draw(dt), Game.update(dt)
    this.gameMap = new GameMap(this.ctx, window.innerWidth, window.innerHeight);

    // this.action_label = new Label(this.ctx, "Action: ", 675, window.innerHeight - 50);

    this.button = new Button(this.ctx, "Spin", window.innerWidth / 2 - 50, 280, 100, 25);

    this.game = new Game(this.ctx);

    // this.action_label.setWheelLabel(this.game.wheel);

    this.button.onClick = () => {
      this.game.wheel.spin(randomNumber(0.2, 1), randomNumber(10, 50));
      // this.game.wheel.spin(0.1, 1);
    }
  }

  draw(dt: number): void {
    this.button.draw(dt);
    this.game.draw(dt);
    // this.action_label.draw(dt);
    this.gameMap.draw();
  }

  update(dt: number): void {
    this.button.update(dt);
    this.game.update(dt);
    // this.action_label.update(dt);
  }
}


export class NicknameInputScene extends Scene {
  constructor(ctx: CanvasRenderingContext2D) {
    super(ctx);
  }

  draw(): void {
    this.ctx.fillStyle = "green";
    // console.log("Nickname Input Scene...");
    this.ctx.fillRect(50, 50, 15, 15);
  }

  update(): void {

  }
}
