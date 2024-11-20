import { GameMap } from "@game/game_map";
import { randomNumber } from "@utils/funcs";
import { Button } from "@UI/button";
import { Label } from "@UI/label";
import { Game } from "@game/game";
import { Screen } from "@utils/screen";
import { GameObject } from "@utils/game_object";

abstract class Scene {
  // objects: GameObject[] = [];
  objects: Map<string, any> = new Map<string, any>();
  // "game": [...gameobjects]
  // ["wheel": Wheel, "whose_turn": Player, "other": Player, "targets": [
  //  "target1": Target,
  //  "target2": Target,
  //  ...
  // ]]
  // get("game").get("targets").get("target1");
  // get("game").delete("targets");
  // "gameMap": GameMap
  // "restart_button": Button

  constructor(public ctx: CanvasRenderingContext2D) { }


  // appendToFront function will insert an object at the beginning of array thus drawing it first
  appendToFront(objects: GameObject | Array<any>) {
    console.log("Is an array: " + (objects instanceof Array));
    if (objects instanceof Array) {
      let gameobject_arrays = [objects];

      console.log("Gameobject Array: ");
      console.log(gameobject_arrays[0]);
      // And also gotta check if the length of the array is greater than zero

      while (gameobject_arrays.find(value => value instanceof Array)) {
        let array = gameobject_arrays[0]

        for (const object of array) {
          if (object instanceof GameObject) {
            this.objects.unshift(object);
          }
          else if (object as any instanceof Array) {
            gameobject_arrays.push(object);

            console.log("Found another GameObject array...");
            console.log(object);
          }
        }
        console.log("New GameObject Arrays variable:");
        console.log(gameobject_arrays);

        gameobject_arrays.splice(gameobject_arrays.indexOf(array), 1);

        console.log("Removing current array...");
        console.log(gameobject_arrays);
      }
      console.log("Final objects array:");
      console.log(this.objects);
      // Array<Array<GameObject>>
      // this.objects.unshift(...objects);
    }
    else if (objects instanceof GameObject) {
      this.objects.unshift(objects);
    }
  }

  // appendToBack function will append an object at the end of array thus drawing it last
  appendToBack(name: string, object: GameObject) {
    // this.objects.push(object);
    this.objects.set(name, object);
  }

  removeObjectByName(name: string) { }

  // if the reference isn't found on the array, throw an error
  removeObjectByReference(object: GameObject) {
    // const index = this.objects.indexOf(object);
    // if (index > -1) {
    //   this.objects.splice(index, 1);
    // }
  }

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

    this.appendToBack(this.gameMap);
    this.appendToBack(this.restart_button);

  }

  draw(dt: number): void {
    for (let i = 0; i < this.objects.length; i++) {
      this.objects[i].draw(dt);
    }
    // this.game.draw(dt);
    // this.gameMap.draw(dt);
    //
    // if (!this.game.game_over_message.visible && this.game.game_over_message.animation_triggered) {
    //   this.restart_button.draw(dt);
    // }
  }

  update(dt: number): void {
    // this.restart_button.update(dt);
    // this.game.update(dt);
    for (let i = 0; i < this.objects.length; i++) {
      this.objects[i].update(dt);
    }
    this.game.handleActions();
    this.appendToFront(this.game.objects); // we'll have to check if each object of this array is of GameObject instance
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
