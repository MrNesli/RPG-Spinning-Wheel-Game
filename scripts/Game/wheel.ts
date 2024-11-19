// import { Sprite } from "./sprite";
import { drawSegmentedCircle, drawTriangle, rotatePoint, degrees_to_radians, drawArc, randomNumber, randomNumberFloat } from "@utils/funcs";
import { GameObject } from "@utils/game_object";
import { WheelIcon } from "@game/wheel_icon";
import { Button } from "@UI/button";

export interface SegmentsIcon {
  [key: string]: WheelIcon;
}

export class Wheel extends GameObject {
  spin_button: Button;

  arrow_size: number = 20;
  animation_state: string;
  wheel_rotation: number;
  wheel_rotation_duration: number;
  wheel_timer: number;
  wheel_rotation_speed: number;
  wheel_rotation_max_speed: number;
  is_spinning: boolean;
  result_item: any | undefined;
  segments_icon: SegmentsIcon;

  constructor(
    ctx: CanvasRenderingContext2D,
    public wheel_segments: number,
    public wheel_x: number, // Coordinates of the center origin point
    public wheel_y: number, //
    public wheel_radius: number,
    icons: WheelIcon[]
  ) {
    if (wheel_segments !== icons.length) {
      throw new Error("The number of segments and icons must be equal.");
    }
    super(ctx, null, wheel_x, wheel_y);
    this.animation_state = "idle";
    this.is_spinning = false;
    this.wheel_rotation = 0;
    this.wheel_rotation_duration = 0; // in seconds
    this.wheel_timer = 0;
    this.wheel_rotation_speed = 0; // in degrees
    this.wheel_rotation_max_speed = 0;
    this.result_item = undefined;
    this.segments_icon = {};

    for (let i = 0; i < this.wheel_segments; i++) {
      this.segments_icon[`segment${i + 1}`] = icons[i];
    }

    this.spin_button = new Button(this.ctx, "Spin", 0, 0, 100, 25);
    this.spin_button.x = this.wheel_x - this.spin_button.width / 2;
    this.spin_button.y = this.wheel_y + this.wheel_radius + this.spin_button.height / 2 + 15;

    this.spin_button.onClick = () => {
      // console.log("here:");
      // this.result_item = new WheelIcon(this.ctx, "Heal", "../images/heal_potion.png", 0, 0);
      this.spin(randomNumberFloat(0.01, 0.02), randomNumber(30, 50));
    }
  }

  draw(dt: number) {
    // drawArc(this.ctx, this.wheel_x, this.wheel_y, 3, 0, Math.PI * 2);
    this.spin_button.draw(dt);
    drawTriangle(this.ctx, this.wheel_x, this.wheel_y - this.wheel_radius, this.arrow_size);
    drawSegmentedCircle(this.ctx, this.wheel_segments, this.wheel_x, this.wheel_y, this.wheel_radius, this.wheel_rotation, this.segments_icon);
    // console.log("Wheel rotation in degrees: " + this.wheel_rotation * 180 / Math.PI);
  }

  spin(duration: number, speed: number) {
    console.log("Spinning the wheel");
    if (!this.is_spinning) {
      this.animation_state = "acceleration";
      this.is_spinning = true;
      // this.result_item = undefined;
      // this.wheel_rotation = 0;
      this.wheel_rotation_duration = duration;
      this.wheel_rotation_max_speed = speed;
    }
  }

  empty() {
    this.result_item = undefined;
  }

  animate_spin(dt: number) {
    // Turn the wheel while it hasn't reached the stop point.
    // 
    // While we're not half way through the spin, 
    // increase the speed not surpassing the max speed 
    // 
    // Once we've passed the half way point of the spin
    // we start to decrease the speed also making sure that it's
    // not going below 0.
    //
    // calculate the exactly needed speed to be able to reach the
    // end of spinning smoothly with 60 frames / second
    //
    // Three animation states that have duration:
    // First state: Acceleration
    // Second state: Spinning
    // Third state: Slowing down
    if (this.animation_state != "idle" && this.animation_state != "value") {
      // console.log("Current animation state: " + this.animation_state);
      // console.log("Max rotation speed: " + this.wheel_rotation_max_speed);
      if (this.animation_state == "acceleration") {
        if (this.wheel_rotation_speed < this.wheel_rotation_max_speed) {
          // increases the speed by 6 in 1 second = 10 / 100 * 60
          // this.wheel_rotation_speed += (10 / 100) * dt / 60;

          // Increases the rotation speed by max_rotation_speed every second
          this.wheel_rotation_speed += (this.wheel_rotation_max_speed / 60) * dt / 60;
        }
        else {
          this.animation_state = "spinning";
        }

      }
      else if (this.animation_state == "spinning") {
        // console.log("Wheel timer value: " + this.wheel_timer);
        if (this.wheel_timer < this.wheel_rotation_duration) {
          // (100 / 6) * dt / 60: 1000 per second
          // second per second
          this.wheel_timer += ((100 / 6) * dt / 60) / 1000;
        }
        else {
          this.animation_state = "slowing";
        }
      }
      else if (this.animation_state == "slowing") {
        if (this.wheel_rotation_speed > 0) {
          // Decreases rotation speed by max_rotation_speed every second
          this.wheel_rotation_speed -= (this.wheel_rotation_max_speed / 60) * dt / 60;
        }
        else {
          this.animation_state = "value";
        }
      }

      // Increases the rotation by (15 degrees * speed) 1 second
      this.wheel_rotation += degrees_to_radians((1 / 4) * this.wheel_rotation_speed) * dt / 60;
    }
    else if (this.animation_state as string === "value") {
      // TODO: The coordinates of center arc points are not chaging on wheel rotation
      let x = this.wheel_x;
      let y = this.wheel_y - this.wheel_radius;
      let closestDistance;
      let closestItem;
      for (let i = 1; i <= this.wheel_segments; i++) {
        let item_x = this.segments_icon[`segment${i}`].real_x;
        let item_y = this.segments_icon[`segment${i}`].real_y;
        let rotated_item_pos = rotatePoint(this.wheel_x, this.wheel_y, item_x, item_y, this.wheel_rotation);

        // drawArc(this.ctx, rotated_item_pos.x, rotated_item_pos.y, 5, 0, Math.PI * 2, false, "blue");
        // while (true) {

        drawArc(this.ctx, 15, 15, 5, 0, Math.PI * 2, false, "blue");
        // }

        // console.log("Item position: " + `${item_x} ${item_y}`);
        // console.log("Rotated item position: " + `${Math.floor(rotated_item_pos.x)} ${Math.floor(rotated_item_pos.y)}`);

        let distance = Math.sqrt(
          Math.pow((x - rotated_item_pos.x), 2) +
          Math.pow((y - rotated_item_pos.y), 2)
        );

        if (!closestDistance) {
          closestDistance = distance;
          closestItem = this.segments_icon[`segment${i}`];
        }
        else if (distance < closestDistance) {
          // console.log(`Distance comparison: ${distance} < ${closestDistance}`);
          closestDistance = distance;
          closestItem = this.segments_icon[`segment${i}`];
        }
      }
      // throw new Error("wait");

      this.result_item = closestItem;
      // console.log(this.result_item);
      // console.log(closestItem);
      this.animation_state = "idle";
      this.is_spinning = false;
    }
  }

  update(dt: number) {
    this.animate_spin(dt);
    this.spin_button.update(dt);
    // We gotta update button's coordinates so that it is able to calculate the mouse intersection correctly
    this.spin_button.x = this.wheel_x - this.spin_button.width / 2;
    this.spin_button.y = this.wheel_y + this.wheel_radius + this.spin_button.height / 2 + 15;
  }
}
