import { GameObject } from "@utils/game_object";
import { GameEvents } from "@events/events";

// TODO: Add a CircleButton in the middle of the wheel and when the user clicks on it, 
// it disappears and the wheel starts to rotate. When it stops, the button reappears
export class Button implements GameObject {
  // clicked: boolean;

  constructor(
    public ctx: CanvasRenderingContext2D,
    public text: string,
    public x: number,
    public y: number,
    public width: number,
    public height: number
  ) {
    // this.clicked = false;
  }

  draw(dt: number): void {
    // Rectangular button with text inside of it.
    // If you click on it, it will trigger a user defined event
    this.ctx.beginPath();
    this.ctx.fillStyle = "white";
    this.ctx.textAlign = "center"
    this.ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  onClick: (x: number, y: number) => void = (x: number, y: number) => {
    console.log("Button clicked");
  }

  mouseInside(): boolean {
    if (GameEvents.mouse_x >= this.x &&
      GameEvents.mouse_x <= this.x + this.width &&
      GameEvents.mouse_y >= this.y &&
      GameEvents.mouse_y <= this.y + this.height) {
      return true;
    }
    return false;

  }

  update(dt: number): void {
    if (GameEvents.clicked && !GameEvents.buttons_disabled) {
      if (this.mouseInside()) {
        this.onClick(GameEvents.mouse_x, GameEvents.mouse_y);
        GameEvents.clicked = false;

        console.log("Mouse position: " + GameEvents.mouse_x + " " + GameEvents.mouse_y);
        console.log("Clicked: " + GameEvents.clicked);
      }
    }
  }
}
