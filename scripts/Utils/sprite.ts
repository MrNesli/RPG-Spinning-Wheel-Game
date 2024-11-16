import { GameObject } from "@utils/game_object";

export abstract class Sprite implements GameObject {
  img: HTMLImageElement;
  assets_loaded: boolean = false;

  constructor(
    public ctx: CanvasRenderingContext2D,
    public src: string,
    public x: number = 0,
    public y: number = 0
  ) {

    this.img = new Image();
    this.img.src = src;

    this.img.addEventListener("load", () => {
      this.assets_loaded = true;
    });
  }

  abstract draw(dt: number): void;
  abstract update(dt: number): void;
}
