import { SplineStyle, styles } from "../style";
import { Conte } from "../lib/conte";
import { V2 } from "../lib/vector";
import { ControlPoint, Constraint } from "./ControlPoint";
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

  constrain(pointId: number, constraint: Constraint): void {
    let point = this.getPoint(pointId);
    if (!point.isKnot) {
      status.warn("Can't set constraints on skewers");
      return;
    }
    point.constraint = constraint;
  }

  // returns [Knot, Skewer on the other side of the knot]
  private family(pointId: number): [ControlPoint, ControlPoint|undefined] {
    let shifted = pointId - 1;
    if (shifted % 3 == 0)
      return [this.points[pointId - 1], this.points[pointId - 2] ?? undefined];
    else if (shifted % 3 == 1)
      return [this.points[pointId + 1], this.points[pointId + 2] ?? undefined];
    else
      throw new Error("Family called for a Knot")
  }

  private shiftKnot(pointId: number, diff: V2) {
    let point = this.points[pointId];
    point.incr(diff);
    if (point.requires(Constraint.MOVE_WITH_NEIGHBORS) || point.requires(Constraint.ALIGN) || point.requires(Constraint.MIRROR)) {
      if (pointId > 0)
        this.points[pointId - 1].incr(diff)
      if (pointId < this.points.length - 1)
        this.points[pointId + 1].incr(diff)
    }
  }

  private shiftSkewer(pointId: number, diff: V2) {
    let point = this.points[pointId];
    let [knot, other] = this.family(pointId);
    point.incr(diff);
    if (other == undefined)
      return;

    if (knot.requires(Constraint.ALIGN)) {
      let d1 = knot.distance(point);
      let d2 = knot.distance(other);
      let spotForOther = knot
        .sub(point) // difference vector
        .div(d1)    // normalized difference vector
        .mul(d2)    // preserve original length in align mode
        .add(knot)  // place in reference to knot instead of (0, 0)
      other.set(spotForOther);
    } else if (knot.requires(Constraint.MIRROR)) {
      let d1 = knot.distance(point);
      let spotForOther = knot
        .sub(point) // difference vector
        .div(d1)    // normalized difference vector
        .mul(d1)    // copy length of moved vector
        .add(knot)  // place in reference to knot instead of (0, 0)
      other.set(spotForOther);
    }
  }

  shift(pointId: number, diff: V2) {
    let p = this.points[pointId];
    if (p.isKnot) {
      this.shiftKnot(pointId, diff);
    }
    else {
      this.shiftSkewer(pointId, diff);
    }
  }
}