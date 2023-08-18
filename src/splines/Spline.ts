import { SplineStyle, styles } from "../style";
import { Conte } from "../lib/conte";
import { V2 } from "../lib/vector";
import { ControlPoint, Constraints } from "./ControlPoint";

// Re-exports for deriving classes
export { Conte } from "../lib/conte";
export { V2 } from "../lib/vector";
export { ControlPoint } from "./ControlPoint";

export abstract class Spline {
  points: ControlPoint[];
  style: SplineStyle = styles.splines.DEFAULT;

  constructor(points: V2[]) {
    if (points.length % 3 !== 1) {
      throw new Error(`Points vector does not describe a valid spline. Incorrect length: ${points.length}`)
    }

    this.points = [];

    this.points.push(new ControlPoint(points[0], styles.points.JOINT));
    for (let i = 1; i < points.length; i += 3) {
      this.points.push(new ControlPoint(points[i], styles.points.SKEWER));
      this.points.push(new ControlPoint(points[i+1], styles.points.SKEWER));
      this.points.push(new ControlPoint(points[i+2], styles.points.JOINT));
    }
  }

  abstract draw(ctx: Conte): void;

  catch(v: V2): [number, ControlPoint]|undefined {
    for (let [i, p] of this.points.entries()) {
      if (p.caughtBy(v)) {
        return [i, p];
      }
    }
    return undefined
  }

  shift(pointId: number, diff: V2) {
    this.points[pointId].incr(diff);
  }
}