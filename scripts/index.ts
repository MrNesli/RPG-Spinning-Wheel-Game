import { GameScene } from "@scenes/scene";
import { GameEvents } from "@events/events";

const canvas: HTMLCanvasElement = document.getElementById("game-window") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

canvas.addEventListener("click", (e) => {
  GameEvents.clicked = true;
  GameEvents.mouse_x = e.clientX;
  GameEvents.mouse_y = e.clientY;
  // console.log("Mouse X: " + GameEvents.mouse_x);
  // console.log("Mouse Y: " + GameEvents.mouse_y);
});

canvas.addEventListener("mousemove", (e) => {
  GameEvents.mouse_x = e.x;
  GameEvents.mouse_y = e.y;
  GameEvents.clicked = false;
  // console.log("Mouse position move: " + GameEvents.mouseX + " " + GameEvents.mouseY);
  // console.log("Mouse OVER Target");
  // console.log("Mouse x: " + GameEvents.mouseX);
  // console.log("Mouse y: " + GameEvents.mouseY);
});

if (!ctx) {
  throw new Error("Couldn't get the context.");
}

ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;
// DONE: Main loop
// DONE: Implement Spinning wheel with small action icons
// TODO: Nickname input page - custom input field
// TODO: UI for Game scene (see Figma)
// DONE: Player logic, Spawn attack animations with free target to choose - in Spawn class.
// TODO: Player interface: HP, spawns, spawn_type, perform_action(Action)
// TODO: Game class that will handle whole game's logic: player's action, who's turn, game over condition, etc.
//

class Input {

}


// TODO: Set fixed 60 frames/second framerate
// https://www.kirupa.com/animations/ensuring_consistent_animation_speeds.htm
let gameScene = new GameScene(ctx);
let lastTime: number | null = null;

function render(currentTime: DOMHighResTimeStamp) {

  let deltaTime = currentTime - lastTime!;

  gameScene.clear();

  gameScene.draw(deltaTime);

  gameScene.update(deltaTime);

  requestAnimationFrame(render);

  lastTime = currentTime;
}

function startRenderLoop(currentTime: DOMHighResTimeStamp) {
  lastTime = currentTime;
  requestAnimationFrame(render);
}

requestAnimationFrame(startRenderLoop); // Starting the main loop

