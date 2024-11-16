export class GameEvents {
  static buttons_disabled: boolean;
  static clicked: boolean;
  static mouse_x: number;
  static mouse_y: number;
  static {
    this.buttons_disabled = false;
    this.clicked = false;
    this.mouse_x = -1;
    this.mouse_y = -1;
  }
}

