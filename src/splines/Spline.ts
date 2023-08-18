import { SplineStyle, styles } from "../style";
import { Conte } from "../lib/conte";
import { V2 } from "../lib/vector";
import { ControlPoint, Constraints } from "./ControlPoint";
import { status } from "../status";

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

    this.points.push(new ControlPoint(points[0], true));
    for (let i = 1; i < points.length; i += 3) {
      this.points.push(new ControlPoint(points[i], false));
      this.points.push(new ControlPoint(points[i+1], false));
      this.points.push(new ControlPoint(points[i+2], true));
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

  getPoint(pointId: number): ControlPoint {
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
    return this.points[pointId];
  }

  setConstraint(pointId: number, constraint: Constraints): void {
    let point = this.getPoint(pointId);
    if (!point.joint) {
      status.warn("Can't set constraints on skewers");
      return;
    }
    point.constraints = constraint;
  }

  addConstraint(pointId: number, constraint: Constraints): void {
    let point = this.getPoint(pointId);
    this.setConstraint(pointId, point.constraints | constraint);
  }

  shift(pointId: number, diff: V2) {
    if (pointId < 0 || pointId > this.points.length - 1)
      return;

    let p = this.points[pointId];
    p.incr(diff);
    if (p.requires(Constraints.MOVE_WITH_NEIGHBORS)) {
      this.shift(pointId + 1, diff);
      this.shift(pointId - 1, diff);
    }
  }
}