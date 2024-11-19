export interface IGameObject {
  draw: (dt: number) => void;
  update: (dt: number) => void;
}

export abstract class GameObject implements IGameObject {
  img: HTMLImageElement | undefined = undefined;
  assets_loaded: boolean = false;

  constructor(
    public ctx: CanvasRenderingContext2D,
    public src: string | null = "",
    public x: number = 0,
    public y: number = 0
  ) {

    if (src) {
      this.img = new Image();
      this.img.src = src;

      this.img.addEventListener("load", () => {
        this.assets_loaded = true;
      });
    }
  }

  abstract draw(dt: number): void;
  abstract update(dt: number): void;
}
