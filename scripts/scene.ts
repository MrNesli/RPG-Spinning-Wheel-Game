import { Sprite } from "./sprite";
import { Wheel } from "./wheel";
import { GameMap } from "./game_map";
import { WheelIcon } from "./wheel_icon";
import { randomNumber } from "./funcs";
import { Button } from "./button";
// import { Point } from "./point";
// import { Player } from "./player";
import { Label } from "./label";
import { Game } from "./game";

abstract class Scene {
  constructor(public ctx: CanvasRenderingContext2D) { }

  abstract draw(dt: number): void;
  abstract update(dt: number): void;

  clear() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }
}

export class GameScene extends Scene {
  action_label: Label;

  game: Game;

  gameMap: GameMap;
  wheel: Wheel;
  swordIcon: Sprite;
  potionIcon: Sprite;
  ghostIcon: Sprite;
  warriorIcon: Sprite;
  button: Button;

  constructor(ctx: CanvasRenderingContext2D) {
    super(ctx);

    // TODO: Maybe move the wheel to the Game class so that we call just a few functions
    // like: Game.draw(dt), Game.update(dt)
    this.action_label = new Label(this.ctx, "Action: ", 675, window.innerHeight - 50);

    this.swordIcon = new WheelIcon(this.ctx, "Attack", "../images/sword.png", 0, 0);
    this.potionIcon = new WheelIcon(this.ctx, "Heal", "../images/heal_potion.png", 0, 0);
    this.ghostIcon = new WheelIcon(this.ctx, "Spawn Ghost", "../images/ghost.png", 0, 0);
    this.warriorIcon = new WheelIcon(this.ctx, "Spawn Warrior", "../images/warrior.png", 0, 0);

    this.button = new Button(this.ctx, "Spin", window.innerWidth / 2 - 50, 280, 100, 25);

    this.button.onClick = () => {
      this.wheel.spin(randomNumber(0.2, 1), randomNumber(10, 50));
    }

    this.gameMap = new GameMap(this.ctx, window.innerWidth, window.innerHeight);
    this.wheel = new Wheel(
      this.ctx,
      4,
      window.innerWidth / 2,
      150,
      125,
      [this.swordIcon, this.potionIcon, this.ghostIcon, this.warriorIcon]
    );

    this.game = new Game(this.ctx, this.wheel);

    this.action_label.setWheelLabel(this.wheel);
  }

  // drawSpawns(dt: number) {
  //   for (const ghost of this.ghosts) {
  //     ghost.draw(dt);
  //   }
  //   for (const warrior of this.warriors) {
  //     warrior.draw(dt);
  //   }
  // }
  //
  // updateSpawns(dt: number) {
  //   for (const ghost of this.ghosts) {
  //     ghost.update(dt);
  //   }
  //   for (const warrior of this.warriors) {
  //     warrior.update(dt);
  //   }
  // }

  draw(dt: number): void {
    this.wheel.draw(dt);
    this.button.draw(dt);
    // this.player_1.drawSpawns(dt);
    // this.player_2.drawSpawns(dt);
    this.action_label.draw(dt);
    this.gameMap.draw();
  }

  update(dt: number): void {
    this.button.update(dt);
    this.wheel.update(dt);
    // this.player_1.updateSpawns(dt);
    // this.player_2.updateSpawns(dt);
    this.action_label.update(dt);
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
