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

  setConstraint(pointId: number, constraint: Constraints): void {
    if (pointId < 0) {
      let passed = pointId;
      pointId = this.points.length + pointId;
      if (pointId < 0) {
        throw new Error(`Invalid pointId ${pointId} evaluated from ${passed}`);
      }
    }
    else if (pointId >= this.points.length) {
      throw new Error(`Invalid pointId ${pointId} greater than actual points count`);
    }
    // console.log(pointId);
    // console.log(this.points);
    let point = this.points[pointId];
    point.constraints = constraint;
  }

  addConstraint(pointId: number, constraint: Constraints): void {
    throw new Error("not implemented");
  }

  shift(pointId: number, diff: V2) {
    let p = this.points[pointId];
    p.incr(diff);
    // if (p.requires(Constraints.FIX_LEFT)) {
    //   this.points[pointId - 1].incr(diff);
    // }
  }
}