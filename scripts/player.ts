import { Point } from "./point";
import { Ghost, Spawn, Warrior } from "./spawn";

export class Player {
  spawns: Spawn[];
  hp: number;

  constructor(
    public id: number,
    public ctx: CanvasRenderingContext2D,
    public number_of_spawns: number,
    public spawn_type: string,
    public spawn_group_pos: Point
  ) {
    this.spawns = [];
    // console.log("TYPE: " + spawn_type);

    if (this.spawn_type === "Ghost") {
      for (let i = 0; i < this.number_of_spawns; i++) {
        this.spawns.push(
          new Ghost(this.ctx, this.spawn_group_pos.x - (i % 2 * 50), this.spawn_group_pos.y + (i * 50))
        );
      }
    }
    else if (this.spawn_type === "Warrior") {
      for (let i = 0; i < this.number_of_spawns; i++) {
        this.spawns.push(
          new Warrior(this.ctx, this.spawn_group_pos.x + (i % 2 * 50), this.spawn_group_pos.y + (i * 50))
        );
      }
    }

    this.hp = this.spawns.map(spawn => spawn.hp).reduce((partialSum, health) => partialSum + health, 0);
    console.log(`Player${id}'s hitpoints: ${this.hp}`);
  }

  drawSpawns(dt: number) {
    for (const spawn of this.spawns) {
      spawn.draw(dt);
    }
  }

  updateSpawns(dt: number) {
    for (const spawn of this.spawns) {
      spawn.update(dt);
    }
  }
}
