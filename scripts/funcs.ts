import { Items } from "./wheel";

const colors = ["orange", "red", "blue", "yellow", "green", "purple"];

// https://stackoverflow.com/questions/17410809/how-to-calculate-rotation-in-2d-in-javascript
export function rotatePoint(cx: number, cy: number, x: number, y: number, angle: number): { x: number, y: number } {
  let cos = Math.cos(angle);
  let sin = Math.sin(angle);
  let rotated_x = (cos * (x - cx)) - (sin * (y - cy)) + cx;
  let rotated_y = (sin * (x - cx)) + (cos * (y - cy)) + cy;
  return { x: rotated_x, y: rotated_y };
}

export function randomNumber(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function drawTriangle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string = "black",
) {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.moveTo(x, y);
  ctx.lineTo(x + size, y - size);
  ctx.lineTo(x - size, y - size);
  ctx.fill();

}

export function drawArc(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  start_angle: number,
  end_angle: number,
  stroke: boolean = false,
  fill_style: string = "black",
  stroke_style: string = "red"
) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.fillStyle = fill_style;
  ctx.strokeStyle = stroke_style;
  ctx.arc(x, y, radius, start_angle, end_angle);
  if (stroke) {
    ctx.stroke();
  }
  else {
    ctx.fill();
  }
}

export function degrees_to_radians(degree: number): number {
  return degree * (Math.PI / 180);
}

export function radians_to_degrees(radian: number): number {
  return radian * (180 / Math.PI);
}
// Math.

export function drawSegmentedCircle(
  ctx: CanvasRenderingContext2D,
  number_of_segments: number,
  x: number,
  y: number,
  radius: number,
  rotation: number,
  items: Items,
  debug: boolean = false
) {

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.translate(-x, -y);

  let segment_angle = 360 / number_of_segments; // single segment angle
  for (let segment = 1; segment <= number_of_segments; segment++) {
    // Range of ith segment's angle converted to radians
    let angle_start = ((segment - 1) * segment_angle);
    let angle_end = segment * segment_angle;

    angle_start = degrees_to_radians(angle_start);
    angle_end = degrees_to_radians(angle_end);

    // Drawing the segment
    drawArc(ctx, x, y, radius, angle_start, angle_end, true);

    // getting the quarter coordinate of a radius
    let radius_center_x = x + radius / 4 * Math.cos(angle_end);
    let radius_center_y = y + radius / 4 * Math.sin(angle_end);

    // Unrotated points of each segment's arc center
    // NOTE: We need to rotate them afterhand by the wheel's rotation angle to be able to get the correct position of the point
    // Why? This is beacause rotated canvas isn't keeping the coordinate state of each rotated point.
    // Meaning that if we don't rotate them ourselves after, you will have your arc points standing still at their initial position
    let arc_center_x = x + radius * Math.cos((angle_end - angle_start) * (segment - 0.5));
    let arc_center_y = y + radius * Math.sin((angle_end - angle_start) * (segment - 0.5));

    if (debug) {
      // Item coordinate point for visual understanding
      drawArc(ctx, arc_center_x, arc_center_y, 9, 0, Math.PI * 2, false, "white");
      drawArc(ctx, radius_center_x, radius_center_y, 9, 0, Math.PI * 2, false, colors[segment - 1]);
      ctx.fillText(`${Math.round(radians_to_degrees(angle_end))}`, radius_center_x - 40, radius_center_y);
    }

    ctx.save(); // saving the state of the context

    ctx.translate(radius_center_x, radius_center_y);

    if (debug) {
      console.log("Segment angle: " + segment_angle);
    }

    // Calculating rotation angle to align the item in its own segment
    // NOTE: We have to multiply the rotation by -1 if the segment isn't pair 
    // because the circle rotates in the clockwise direction
    let item_rotation = degrees_to_radians(-90) - (degrees_to_radians(segment_angle / 2) + (number_of_segments - segment) * degrees_to_radians(segment_angle));

    ctx.rotate(item_rotation);

    ctx.translate(-radius_center_x, -radius_center_y);

    // Coordinate offsets to align the sprite well in the circle's segment
    let y_offset = radius / 5;
    let x_offset = -5;

    // Coordinates of the item relative to the rotated point (segment)
    // NOTE: IT DOESN'T TRANSFORM COORDINATES TO ROTATED STATE. THOSE ARE JUST COORDINATES FOR DRAWING ON THE SCREEN
    items[`segment${segment}`].set(radius_center_x + x_offset, radius_center_y + y_offset);

    // Setting segment's arc center point to be able to calculate the distance to the wheel arrow.
    items[`segment${segment}`].setReal(arc_center_x, arc_center_y);

    items[`segment${segment}`].draw();


    ctx.restore(); // restoring the state of the context
  }

  drawArc(ctx, x, y, radius, 0, Math.PI * 2, false, "#3F2631"); // a circle

  ctx.restore();
  if (debug) {
    drawArc(ctx, x, y - radius, 9, 0, Math.PI * 2, false, "white");
  }
}
