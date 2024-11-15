export class GameEvents {
  static clicked: boolean;
  static mouseX: number;
  static mouseY: number;
  static {
    this.clicked = false;
    this.mouseX = -1;
    this.mouseY = -1;
  }
}

