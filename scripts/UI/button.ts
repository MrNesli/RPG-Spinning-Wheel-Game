import { GameObject } from "@utils/game_object";
import { GameEvents } from "@events/events";
import { drawArc } from "@utils/funcs";

// TODO: Add a CircleButton in the middle of the wheel and when the user clicks on it, 
// it disappears and the wheel starts to rotate. When it stops, the button reappears
export class Button extends GameObject {
  // clicked: boolean;

  constructor(
    ctx: CanvasRenderingContext2D,
    public text: string,
    x: number,
    y: number,
    public width: number,
    public height: number
  ) {
    super(ctx, null, x, y);
  }

  draw(dt: number): void {
    // Rectangular button with text inside of it.
    // If you click on it, it will trigger a user defined event
    this.ctx.beginPath();
    // drawArc(this.ctx, this.x, this.y, 3, 0, Math.PI * 2);
    // drawArc(this.ctx, this.x + this.width, this.y, 3, 0, Math.PI * 2);
    // drawArc(this.ctx, this.x + this.width, this.y + this.height, 3, 0, Math.PI * 2);
    this.ctx.fillStyle = "white";
    this.ctx.textAlign = "center"
    this.ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  onClick: () => void = () => {
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
        this.onClick();
        GameEvents.clicked = false;

        console.log("Mouse position: " + GameEvents.mouse_x + " " + GameEvents.mouse_y);
        console.log("Clicked: " + GameEvents.clicked);
      }
    }
  }
}
