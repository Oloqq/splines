import { SplineStyle, styles } from "../style";
import { Conte } from "../lib/conte";
import { V2 } from "../lib/vector";

// Re-exports for deriving classes
export { Conte } from "../lib/conte";
export { V2 } from "../lib/vector";

export class ControlPoint extends V2 {
  constructor(x: number, y: number) {
    super(x, y);
  }
}

export abstract class Spline {
  points: ControlPoint[];
  style: SplineStyle = styles.splines.DEFAULT;

  constructor(points: V2[]) {
    if (points.length % 3 !== 1) {
      throw new Error(`Points vector does not describe a valid spline. Incorrect length: ${points.length}`)
    }

    this.points = [];
    this.points.push(points[0]);
    for (let i = 1; i < points.length; i += 3) {
      this.points.push(points[i]);
      this.points.push(points[i+1]);
      this.points.push(points[i+2]);
    }
  }

  abstract draw(ctx: Conte): void;

  catch(v: V2): V2|undefined {
    for (let p of this.points) {
      if (p.distance(v) < 20) {
        return p;
      }
    }
    return undefined
  }
}