import { GameObject } from "@utils/game_object";
import { Point } from "@utils/point";
import { Spawn } from "@game/spawn";

const ghost_group_pos: Point = { x: 850, y: 400 };
const warrior_group_pos: Point = { x: 450, y: 400 };

export class Player implements GameObject {
  spawns: Spawn[];
  hp: number = 0;

  constructor(
    public id: number,
    public ctx: CanvasRenderingContext2D,
    public number_of_spawns: number,
    public spawn_type: string
  ) {
    this.spawns = [];

    // Based on the spawn type we have to position the group of spawns correctly
    if (this.spawn_type === "Ghost") {
      for (let i = 0; i < this.number_of_spawns; i++) {
        this.spawns.push(
          new Spawn(this.ctx, this.spawn_type, ghost_group_pos.x - (i % 2 * 50), ghost_group_pos.y + (i * 50))
        );
      }
    }
    else if (this.spawn_type === "Warrior") {
      for (let i = 0; i < this.number_of_spawns; i++) {
        this.spawns.push(
          new Spawn(this.ctx, this.spawn_type, warrior_group_pos.x + (i % 2 * 50), warrior_group_pos.y + (i * 50))
        );
      }
    }

  }

  calc_hp() {
    // Calculate player's health points by summing up the healthpoints of his spawns.
    this.hp = this.spawns.map(spawn => spawn.hp).reduce((partialSum, health) => partialSum + health, 0);
    // console.log(`Player${this.id}'s hitpoints: ${this.hp}`);
  }

  heal(hp: number) {
    // Heals spawns that are alive
    let to_heal = hp;
    for (let i = 0; i < this.spawns.length; i++) {
      if (this.spawns[i].hp < this.spawns[i].max_hp &&
        to_heal > 0 &&
        this.spawns[i].hp > 0
      ) {
        let diff = this.spawns[i].max_hp - this.spawns[i].hp;
        if (diff >= to_heal) {
          this.spawns[i].hp += to_heal;
          to_heal = 0;
        }
        else if (diff < to_heal) {
          this.spawns[i].hp += (to_heal - diff);
          to_heal -= diff;
        }
      }
    }
  }

  attack(target: Player, target_spawn_id: number) {
    let spawn_alive = this.spawns.find((spawn, index) => spawn.hp > 0);

    if (spawn_alive) {
      console.log("Found spawn alive: " + this.spawn_type);
      spawn_alive.attack(target.spawns[target_spawn_id]);
      console.log("Attacking spawn: " + target.spawns[target_spawn_id].spawn_type);
    }
  }

  draw(dt: number) {
    this.drawSpawns(dt);
  }

  update(dt: number) {
    this.updateSpawns(dt);
    this.updateHp();
  }

  addSpawn() {
    for (let i = 0; i < this.spawns.length; i++) {
      if (this.spawns[i].hp <= 0) {
        this.spawns[i].hp = 10;
        break;
      }
    }
  }

  drawSpawns(dt: number) {
    for (const spawn of this.spawns) {
      if (spawn.hp > 0) {
        spawn.draw(dt);
      }
    }
  }

  updateSpawns(dt: number) {
    for (const spawn of this.spawns) {
      if (spawn.hp > 0) {
        spawn.update(dt);
      }
    }
  }

  updateHp() {
    this.calc_hp();
  }
}
