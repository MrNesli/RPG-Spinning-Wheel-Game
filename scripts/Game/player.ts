import { GameObject } from "@utils/game_object";
import { Point } from "@utils/point";
import { Spawn } from "@game/spawn";

// const ghost_group_pos: Point = { x: 850, y: 400 };
// const warrior_group_pos: Point = { x: 450, y: 400 };
const ghost_group_pos: Point = { x: window.innerWidth / 2 + 200, y: window.innerHeight / 2 + 75 };
const warrior_group_pos: Point = { x: window.innerWidth / 2 - 200, y: window.innerHeight / 2 + 75 };
const offset_y = 75;
const offset_x = 60;

export class Player extends GameObject {
  nickname: string;
  spawns: Spawn[];
  hp: number = 0;
  max_hp: number;

  constructor(
    public id: number,
    ctx: CanvasRenderingContext2D,
    public number_of_spawns: number,
    public spawn_type: string
  ) {
    super(ctx, null, 0, 0);
    this.spawns = [];
    this.nickname = `Player${this.id}`;

    // Based on the spawn type we have to position the group of spawns correctly
    if (this.spawn_type === "Ghost") {
      for (let i = 0; i < this.number_of_spawns; i++) {
        this.spawns.push(
          new Spawn(this, this.ctx, this.spawn_type, ghost_group_pos.x - (i % 2 * offset_x), ghost_group_pos.y + (i * offset_y))
        );
      }
    }
    else if (this.spawn_type === "Warrior") {
      for (let i = 0; i < this.number_of_spawns; i++) {
        this.spawns.push(
          new Spawn(this, this.ctx, this.spawn_type, warrior_group_pos.x + (i % 2 * offset_x), warrior_group_pos.y + (i * offset_y))
        );
      }
    }

    this.calc_hp();
    this.max_hp = this.hp;

    // this.spawns[0].hp -= 9;
    // this.spawns[1].hp -= 9;
    // this.spawns[2].hp -= 9;
  }

  spawns_dead(): boolean {
    for (let i = 0; i < this.number_of_spawns; i++) {
      if (this.spawns[i].hp <= 0) {
        return true;
      }
    }
    return false;
  }

  calc_hp() {
    // Calculate player's health points by summing up the healthpoints of his spawns.
    this.hp = this.spawns.map(spawn => spawn.hp).reduce((partialSum, health) => partialSum + health, 0);
    // console.log(`Player${this.id}'s hitpoints: ${this.hp}`);
  }

  heal(hp: number) {
    // Heals spawns that are alive
    // 8; 9; 7 => 5
    // (10 - 8) = 2; 8 + 2 = 10; 5 - 2 = 3;
    // (10 - 9) = 1; 9 + 1 = 10; 3 - 1 = 2;
    // (10 - 7) = 3; 7 + (
    // (10 - 8) 
    let to_heal = hp;
    console.log("To heal: " + to_heal);
    for (let i = 0; i < this.spawns.length; i++) {
      if (to_heal <= 0) {
        console.log("Can't heal anymore");
        break;
      }

      if (this.spawns[i].hp < this.spawns[i].max_hp && this.spawns[i].hp > 0) {
        let diff = this.spawns[i].max_hp - this.spawns[i].hp;

        if (diff <= to_heal) {
          this.spawns[i].hp += diff;
          console.log("Healed by " + diff);
          to_heal -= diff;
        }
        else {
          this.spawns[i].hp += to_heal;
          console.log("Healed by " + to_heal);
          to_heal = 0;
        }
      }
    }
    if (to_heal === hp) {
      console.log("There is no one to heal.");
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
