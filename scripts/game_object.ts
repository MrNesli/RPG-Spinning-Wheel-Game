export interface GameObject {
  draw: (dt: number) => void;
  update: (dt: number) => void;
}
