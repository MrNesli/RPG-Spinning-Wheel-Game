import { GameMap } from "@game/game_map";
import { randomNumber } from "@utils/funcs";
import { Button } from "@UI/button";
import { Label } from "@UI/label";
import { Game } from "@game/game";
import { Screen } from "@utils/screen";
import { GameObject } from "@utils/game_object";

abstract class Scene {
  objects: GameObject[] = [];

  constructor(public ctx: CanvasRenderingContext2D) { }


  // appendToFront function will insert an object at the beginning of array thus drawing it first
  appendToFront(objects: GameObject | Array<GameObject>) {
    console.log("Type of objects: " + typeof objects);
    if (objects instanceof Array) {
      this.objects.unshift(...objects);
    }
    else if (objects instanceof GameObject) {
      this.objects.unshift(objects);
    }
  }

  // appendToBack function will append an object at the end of array thus drawing it last
  appendToBack(object: GameObject) { }
  removeObjectByName(name: string) { }
  // if the reference isn't found on the array, throw an error
  removeObjectByReference(object: GameObject) { }

  abstract draw(dt: number): void;
  abstract update(dt: number): void;

  clear() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }
}

export class GameScene extends Scene {

  game: Game;
  gameMap: GameMap;
  restart_button: Button;

  constructor(ctx: CanvasRenderingContext2D) {
    super(ctx);
    // When the game over message fades we gotta show the Restart button.

    Screen.updateSizeProportions(ctx);
    this.gameMap = new GameMap(this.ctx, window.innerWidth, window.innerHeight);

    this.restart_button = new Button(this.ctx, "Restart the game", window.innerWidth / 2, window.innerHeight / 2, 100, 25);
    this.restart_button.onClick = () => {
      this.game.game_over_message.animation_triggered = false;
    }

    this.game = new Game(this.ctx);

  }

  draw(dt: number): void {
    this.game.draw(dt);
    this.gameMap.draw(dt);

    if (!this.game.game_over_message.visible && this.game.game_over_message.animation_triggered) {
      this.restart_button.draw(dt);
    }
  }

  update(dt: number): void {
    this.restart_button.update(dt);
    this.game.update(dt);
  }

  // Create an array that is going to automatically draw and update every single object in the game


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
