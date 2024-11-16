import { Wheel } from "@game/wheel";
import { Player } from "@game/player";
// import { Point } from "./point";
// import { Sprite } from "./sprite";
import { WheelIcon } from "@game/wheel_icon";
import { GameObject } from "@utils/game_object";
import { randomNumber } from "@utils/funcs";
import { Target } from "./target";
import { GameEvents } from "@events/events";

// Class that describes the logic of the game
export class Game implements GameObject {
  // DONE: Action system, Animations
  // TODO: UI for the game: player's nickname with healthpoints bar (see figma)
  // TODO: Stacked fading in/out messages, guide label at the bottom of the screen
  // TODO: Scene manager, Choosing nickname page, game over page, win page

  // Player 1 group of spawns
  // Player 2 group of spawns
  // Reference to the wheel
  // It's gonna wait for the wheel to finish spinning,
  // It's going to get the value, for example: attack...
  // Actions
  // Who's turn
  // Exectue different actions: Actions.attack(player1, player2), Actions.heal(player)
  // wheel's label is attack => target = chooseTarget(): returns spawn's index; => player1.attack(player2, target) 
  // player1.attack(player2);
  // player1.heal(5)
  // player1.addSpawn();
  //
  // When the action has been determined by the wheel, there will be fading in/out message telling
  // the users what they have to do, whose turn is it, etc. 
  // We can stack fading messages
  // Tiny text guideline at the bottom of the screen telling the player what he needs to do...
  //
  // Animations for those actions... Attack animation: When the attack action has been chosen
  // 

  // After actions, add fading in/out messages telling the player what action has been chosen, and also, add a tiny label
  // at the bottom of the page that's going to explain to the player what he needs to do.
  //
  //

  whose_turn: Player;
  other: Player;

  player_1: Player;
  player_2: Player;

  wheel: Wheel;

  targets: Target[];

  swordIcon: WheelIcon;
  swordIcon2: WheelIcon;
  swordIcon3: WheelIcon;
  potionIcon: WheelIcon;
  ghostIcon: WheelIcon;
  warriorIcon: WheelIcon;

  constructor(
    public ctx: CanvasRenderingContext2D
  ) {

    this.swordIcon = new WheelIcon(this.ctx, "Attack", "../images/sword.png", 0, 0);
    this.swordIcon2 = new WheelIcon(this.ctx, "Attack", "../images/sword.png", 0, 0);
    this.swordIcon3 = new WheelIcon(this.ctx, "Attack", "../images/sword.png", 0, 0);
    this.potionIcon = new WheelIcon(this.ctx, "Heal", "../images/heal_potion.png", 0, 0);
    this.ghostIcon = new WheelIcon(this.ctx, "Spawn Ghost", "../images/ghost.png", 0, 0);
    this.warriorIcon = new WheelIcon(this.ctx, "Spawn Warrior", "../images/warrior.png", 0, 0);

    // this.target = new Target(this.ctx, 450, 400);
    // this.target2 = new Target(this.ctx, 500, 450);
    // this.target3 = new Target(this.ctx, 450, 500);


    this.wheel = new Wheel(
      this.ctx,
      6,
      window.innerWidth / 2,
      150,
      125,
      [this.swordIcon, this.swordIcon2, this.swordIcon3, this.potionIcon, this.ghostIcon, this.warriorIcon]
    );

    this.player_1 = new Player(1, this.ctx, 3, "Ghost");
    this.player_2 = new Player(2, this.ctx, 3, "Warrior");

    let rand_num = randomNumber(1, 2);
    this.whose_turn = rand_num === 1 ? this.player_1 : this.player_2;
    this.other = rand_num === 1 ? this.player_2 : this.player_1;

    this.targets = [];
    this.getTargets();
    console.log("Whose turn: " + this.whose_turn.spawn_type);
    console.log("Other: " + this.other.spawn_type);
  }

  activateTargets() {
    for (let i = 0; i < this.other.number_of_spawns; i++) {
      // Like instead of doing hp > 0 you could just have alive() method
      if (this.other.spawns[i].hp > 0) {
        this.targets[i].activate();
      }
    }
  }

  deactivateTargets() {
    for (let i = 0; i < this.other.number_of_spawns; i++) {
      this.targets[i].deactivate();
    }
  }

  getTargets() {
    this.targets = [];
    for (let i = 0; i < this.other.number_of_spawns; i++) {
      this.targets.push(
        new Target(this.ctx, i, this.other.spawns[i].x, this.other.spawns[i].y)
      );
    }
  }

  drawTargets(dt: number) {
    for (let i = 0; i < this.targets.length; i++) {
      this.targets[i].draw(dt);
    }
  }

  updateTargets(dt: number) {
    for (let i = 0; i < this.targets.length; i++) {
      this.targets[i].update(dt);
    }
  }

  draw(dt: number) {
    this.wheel.draw(dt);
    this.drawTargets(dt);
    this.player_1.draw(dt);
    this.player_2.draw(dt);
  }

  toggleTurn() {
    if (this.whose_turn === this.player_1) {
      this.whose_turn = this.player_2;
      this.other = this.player_1;
    }
    else {
      this.whose_turn = this.player_1;
      this.other = this.player_2;
    }

    this.getTargets();
  }
  // Target entity with the reference to the ghost's index in enemy player's array
  // Create a bounding box for the target
  // Target scaling animation
  //

  update(dt: number) {
    if (this.wheel.result_item) {
      let action = this.wheel.result_item.label;
      console.log("Wheel's action: " + action);

      if (action === "Attack") {
        // Disable buttons
        GameEvents.buttons_disabled = true;
        this.activateTargets();
        for (let i = 0; i < this.targets.length; i++) {
          this.targets[i].onClick = () => {
            this.deactivateTargets();
            this.whose_turn.attack(this.other, this.targets[i].spawn_id);
            GameEvents.buttons_disabled = false;
            this.wheel.result_item = undefined;
            this.toggleTurn();
          };
        }
      }
      else if (action === "Heal") {
        this.whose_turn.heal(randomNumber(1, 8));
        this.toggleTurn();
      }
      else if (action === "Spawn Ghost") {
        if (this.whose_turn.spawn_type === "Ghost") {
          this.whose_turn.addSpawn();
        }
        else {
          this.other.addSpawn();
        }
        this.toggleTurn();
      }
      else if (action === "Spawn Warrior") {
        if (this.whose_turn.spawn_type === "Warrior") {
          this.whose_turn.addSpawn();
        }
        else {
          this.other.addSpawn();
        }
        this.toggleTurn();
      }
    }
    this.wheel.update(dt);
    this.updateTargets(dt);
    this.player_1.update(dt);
    this.player_2.update(dt);
  }
}
