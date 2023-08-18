import styles from "../style";
import { ControlPoint, Constraints } from "./ControlPoint";
import { Spline, Conte, V2 } from "./Spline";

export class BezierSpline extends Spline {
  constructor(points: V2[]) {
    super(points);
  }

  static sample(): BezierSpline {
    return new BezierSpline([new V2(100, 200), new V2(140, 100), new V2(180, 100), new V2(420, 200)]);
  }

  draw(ctx: Conte): void {
    for (let i = 0; i < this.points.length - 1; i += 3) {
      ctx.styledStroke(this.style.curve, () => {
        ctx.vmoveTo(this.points[i]);
        ctx.vbezierTo(this.points[i+1], this.points[i+2], this.points[i+3]);
      });
      ctx.withStyle(this.style.skewers, () => {
        ctx.beginPath();
        ctx.vmoveTo(this.points[i]);
        ctx.vlineTo(this.points[i+1]);
        ctx.stroke();

        ctx.beginPath();
        ctx.vmoveTo(this.points[i+3]);
        ctx.vlineTo(this.points[i+2]);
        ctx.stroke();
      });
    }

    for (let p of this.points) {
      p.draw(ctx);
    }
  }

  prepend(points: V2[]): BezierSpline {
    if (points.length % 3 !== 0) {
      throw new Error(`Points vector does not describe a valid spline extension. Incorrect length: ${points.length}`)
    }

    let prefix = [];
    for (let i = 0; i < points.length; i += 3) {
      prefix.push(new ControlPoint(points[i], styles.points.JOINT));
      prefix.push(new ControlPoint(points[i+1], styles.points.SKEWER));
      prefix.push(new ControlPoint(points[i+2], styles.points.SKEWER));
    }
    this.points.unshift(...prefix);

    return this;
  }

  append(points: V2[]): BezierSpline {
    if (points.length % 3 !== 0) {
      throw new Error(`Points vector does not describe a valid spline extension. Incorrect length: ${points.length}`)
    }

    for (let i = 0; i < points.length; i += 3) {
      this.points.push(new ControlPoint(points[i], styles.points.SKEWER));
      this.points.push(new ControlPoint(points[i+1], styles.points.SKEWER));
      this.points.push(new ControlPoint(points[i+2], styles.points.JOINT));
    }

    return this;
  }

  setConstraint(pointId: number, constraint: Constraints): BezierSpline {
    if (pointId < 0) {
      pointId = this.points.length - pointId;
      if (pointId < 0) {
        throw new Error(`Invalid pointId ${this.points.length + pointId} evaluated to ${pointId}`);
      }
    }
    else if (pointId >= this.points.length) {
      throw new Error(`Invalid pointId ${pointId} greater than actual points count`);
    }

    let point = this.points[pointId];
    point.constraints = constraint;

    return this;
  }
}