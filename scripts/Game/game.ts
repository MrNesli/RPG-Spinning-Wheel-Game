import { Wheel } from "@game/wheel";
import { Player } from "@game/player";
// import { Point } from "./point";
// import { Sprite } from "./sprite";
import { WheelIcon } from "@game/wheel_icon";
import { GameObject } from "@utils/game_object";
import { randomNumber } from "@utils/funcs";
import { Target } from "./target";
import { GameEvents } from "@events/events";
import { HealthBar } from "@UI/health_bar";
import { PlayerHPLabel } from "@UI/player_label";
import { Label } from "@UI/label";
import { PlayerStats } from "@UI/player_stats";
import { FadingMessage } from "@UI/fading_message";
import { Screen } from "@utils/screen";

// Class that describes the logic of the game
export class Game {
  // DONE: Action system, Animations
  // TODO: UI for the game: player's nickname with healthpoints bar (see figma)
  // TODO: Add idle animation for spawns
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
  // TODO: Add a more efficient system of drawing and updating objects to avoid unnecessary code and make it more cleaner.
  // TODO: Game over message that wipes out every object from the game except the game map.
  // TODO: Add a tiny label at the bottom of the screen that's going to tell the user what he has to do
  // TODO: Maybe add an AI that's going to play with the user

  // screen_width_percent: number;
  // screen_height_percent: number;

  guide_label: Label;

  whose_turn: Player;
  other: Player;

  player_1: Player;
  player_2: Player;

  player_1_stats: PlayerStats;
  player_2_stats: PlayerStats;

  wheel: Wheel;

  attack_message: FadingMessage;
  heal_message: FadingMessage;
  add_spawn_message: FadingMessage;
  game_over_message: FadingMessage;

  targets: Target[];

  swordIcon: WheelIcon;
  swordIcon2: WheelIcon;
  swordIcon3: WheelIcon;
  swordIcon4: WheelIcon;
  swordIcon5: WheelIcon;
  swordIcon6: WheelIcon;
  potionIcon: WheelIcon;
  ghostIcon: WheelIcon;
  warriorIcon: WheelIcon;

  constructor(
    public ctx: CanvasRenderingContext2D
  ) {
    // Initializing
    // this.screen_width_percent = this.ctx.canvas.width / 100;
    // this.screen_height_percent = this.ctx.canvas.height / 100;


    this.swordIcon = new WheelIcon(this.ctx, "Attack", "../images/sword.png", 0, 0);
    this.swordIcon2 = new WheelIcon(this.ctx, "Attack", "../images/sword.png", 0, 0);
    this.swordIcon3 = new WheelIcon(this.ctx, "Attack", "../images/sword.png", 0, 0);
    this.swordIcon4 = new WheelIcon(this.ctx, "Attack", "../images/sword.png", 0, 0);
    this.swordIcon5 = new WheelIcon(this.ctx, "Attack", "../images/sword.png", 0, 0);
    this.swordIcon6 = new WheelIcon(this.ctx, "Attack", "../images/sword.png", 0, 0);
    this.potionIcon = new WheelIcon(this.ctx, "Heal", "../images/heal_potion.png", 0, 0);
    this.ghostIcon = new WheelIcon(this.ctx, "Spawn Ghost", "../images/ghost.png", 0, 0);
    this.warriorIcon = new WheelIcon(this.ctx, "Spawn Warrior", "../images/warrior.png", 0, 0);

    this.wheel = new Wheel(
      this.ctx,
      9,
      window.innerWidth / 2,
      150 + Screen.width_percent * 2,
      Screen.width_percent * 10, // 10% of the screen; 125 static value
      [this.swordIcon, this.swordIcon4, this.potionIcon, this.swordIcon2, this.swordIcon5, this.ghostIcon, this.swordIcon3, this.swordIcon6, this.warriorIcon]
    );
    // this.wheel = new Wheel(
    //   this.ctx,
    //   3,
    //   window.innerWidth / 2,
    //   150,
    //   125,
    //   [this.ghostIcon, this.warriorIcon, this.swordIcon3]
    // );

    this.player_1 = new Player(1, this.ctx, 3, "Warrior");
    this.player_2 = new Player(2, this.ctx, 3, "Ghost");

    let rand_num = randomNumber(1, 2);
    this.whose_turn = rand_num === 1 ? this.player_1 : this.player_2;
    this.other = rand_num === 1 ? this.player_2 : this.player_1;

    this.targets = [];
    this.getTargets();

    this.guide_label = new Label(this.ctx, "10px", "white", "", window.innerWidth / 2, window.innerHeight - 15, "center");

    this.player_1_stats = new PlayerStats(this.ctx, this.player_1, 30, 30);
    this.player_2_stats = new PlayerStats(this.ctx, this.player_2, window.innerWidth - 275, 30);

    this.attack_message = new FadingMessage(this.ctx, `${this.whose_turn.nickname} Attacks ${this.other.nickname}`, 1, window.innerWidth / 2, window.innerHeight / 2);
    this.heal_message = new FadingMessage(this.ctx, `Healing spawns of ${this.whose_turn}`, 1, window.innerWidth / 2, window.innerHeight / 2);
    this.add_spawn_message = new FadingMessage(this.ctx, ``, 1, window.innerWidth / 2, window.innerHeight / 2);
    this.game_over_message = new FadingMessage(this.ctx, `Checking`, 1, window.innerWidth / 2, window.innerHeight / 2);
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

  stopSpawns() {
    for (let i = 0; i < this.whose_turn.number_of_spawns; i++) {
      this.whose_turn.spawns[i].stopAllAnimations();
    }

    for (let i = 0; i < this.other.number_of_spawns; i++) {
      this.other.spawns[i].stopAllAnimations();
    }
  }

  getTargets() {
    this.targets = [];
    for (let i = 0; i < this.other.number_of_spawns; i++) {
      this.targets.push(
        new Target(this.ctx, i, this.other)
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

  updateElements() {
    this.wheel.wheel_radius = Screen.width_percent * 12;
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

  reanimateSpawns() {
    for (let i = 0; i < this.whose_turn.number_of_spawns; i++) {
      this.whose_turn.spawns[i].startIdleAnimation();
    }
    for (let i = 0; i < this.other.number_of_spawns; i++) {
      this.other.spawns[i].startIdleAnimation();
    }
  }

  handleActions() {
    if (!GameEvents.attacking) {
      this.attack_message.updatePlaceholder(`${this.whose_turn.nickname} Attacks ${this.other.nickname}`);
      this.attack_message.animation_triggered = false;
      this.reanimateSpawns();
    }
    if (this.wheel.result_item) {
      let action = this.wheel.result_item.label;

      if (action === "Attack") {
        // Disable buttons
        this.guide_label.placeholder = "GUIDE: Click on the enemy spawn to attack it.";
        this.attack_message.startAnimation();
        GameEvents.attacking = true;
        GameEvents.buttons_disabled = true;
        this.activateTargets();
        this.stopSpawns();
        for (let i = 0; i < this.targets.length; i++) {
          this.targets[i].onClick = () => {
            this.deactivateTargets();
            this.whose_turn.attack(this.other, this.targets[i].spawn_id);
            this.wheel.empty();
            GameEvents.buttons_disabled = false;
            this.toggleTurn();
          };
        }
      }
      else if (action === "Heal") {
        let health_points = randomNumber(1, 8);
        // this.guide_label.placeholder = `GUIDE: ${this.whose_turn.nickname} healed by ${health_points} health points`;
        if (this.whose_turn.spawn_type === "Ghost") {
          this.heal_message.updatePlaceholder(`Healing ghosts of ${this.whose_turn.nickname}`);
        }
        else if (this.whose_turn.spawn_type === "Warrior") {
          this.heal_message.updatePlaceholder(`Healing warriors of ${this.whose_turn.nickname}`);
        }
        this.heal_message.startAnimation();
        this.whose_turn.heal(health_points);
        this.wheel.empty();
        this.toggleTurn();
      }
      else if (action === "Spawn Ghost") {
        // TODO: Add fading message: when there are ghosts to add, say "New ghost appeared," if not, "Ghosts are too many"
        this.add_spawn_message.animation_triggered = false;
        if (this.whose_turn.spawn_type === "Ghost") {
          if (this.whose_turn.spawns_dead()) {
            this.whose_turn.addSpawn();
            this.add_spawn_message.updatePlaceholder("New ghost has appeared");
          }
          else {
            this.add_spawn_message.updatePlaceholder("Ghosts are too many");
          }
        }
        else if (this.other.spawn_type === "Ghost") {
          if (this.other.spawns_dead()) {
            this.other.addSpawn();
            this.add_spawn_message.updatePlaceholder("New ghost has appeared");
          }
          else {
            this.add_spawn_message.updatePlaceholder("Ghosts are too many");
          }
        }
        this.add_spawn_message.startAnimation();
        this.wheel.empty();
        this.toggleTurn();
      }
      else if (action === "Spawn Warrior") {
        // TODO: Add fading message 
        this.add_spawn_message.animation_triggered = false;
        if (this.whose_turn.spawn_type === "Warrior") {
          if (this.whose_turn.spawns_dead()) {
            this.whose_turn.addSpawn();
            this.add_spawn_message.updatePlaceholder("New warrior has appeared");
          }
          else {
            this.add_spawn_message.updatePlaceholder("Warriors are too many");
          }
        }
        else if (this.other.spawn_type === "Warrior") {
          if (this.other.spawns_dead()) {
            this.other.addSpawn();
            this.add_spawn_message.updatePlaceholder("New warrior has appeared");
          }
          else {
            this.add_spawn_message.updatePlaceholder("Warriors are too many");
          }
        }
        this.add_spawn_message.startAnimation();
        this.wheel.empty();
        this.toggleTurn();
      }
    }
    else {
      this.guide_label.placeholder = "";
    }
  }

  isGameOver(): boolean {
    if (this.player_1.hp <= 0) {
      // TODO: Add restart button
      this.game_over_message.updatePlaceholder(`${this.player_2.nickname} has won!`);
      this.game_over_message.startAnimation();
      return true;
    }
    else if (this.player_2.hp <= 0) {
      this.game_over_message.updatePlaceholder(`${this.player_1.nickname} has won!`);
      this.game_over_message.startAnimation();
      return true;
    }

    return false;
  }

  draw(dt: number) {
    if (!this.isGameOver()) {
      this.player_1_stats.draw(dt);
      this.player_2_stats.draw(dt);

      this.attack_message.draw(dt);
      this.heal_message.draw(dt);
      this.add_spawn_message.draw(dt);

      this.wheel.draw(dt);
      this.drawTargets(dt);
      this.player_1.draw(dt);
      this.player_2.draw(dt);
      this.guide_label.draw(dt);
    }
    else {
    }
    this.game_over_message.draw(dt);
  }

  update(dt: number) {
    if (!this.isGameOver()) {
      Screen.updateSizeProportions(this.ctx);
      this.updateElements();
      this.handleActions();
      this.wheel.update(dt);
      this.updateTargets(dt);
      this.player_1.update(dt);
      this.player_2.update(dt);
      this.player_1_stats.update(dt);
      this.player_2_stats.update(dt);
      this.attack_message.update(dt);
      this.heal_message.update(dt);
      this.add_spawn_message.update(dt);
      this.guide_label.update(dt);
    }
    else {
    }
    this.game_over_message.update(dt);
  }
}
