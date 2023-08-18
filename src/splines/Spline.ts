import { ControlPointStyle, SplineStyle, styles } from "../style";
import { Conte } from "../lib/conte";
import { V2 } from "../lib/vector";

// Re-exports for deriving classes
export { Conte } from "../lib/conte";
export { V2 } from "../lib/vector";

const NORMAL_CONTROL_POINT_THICC = 1;
const ACTIVE_CONTROL_POINT_THICC = 3;

export class ControlPoint extends V2 {
  style: ControlPointStyle
  active: boolean = false;

  constructor(pos: V2, style: ControlPointStyle) {
    super(pos.x, pos.y);
    this.style = style;
  }

  caughtBy(hook: V2): boolean {
    return hook.distance(this) < this.style.radius;
  }

  draw(ctx: Conte) {
    ctx.beginPath();
    ctx.lineWidth = this.active ? ACTIVE_CONTROL_POINT_THICC : NORMAL_CONTROL_POINT_THICC;
    ctx.arc(this.x, this.y, this.style.radius, 0, 2 * Math.PI);
    ctx.stroke();
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

    this.points.push(new ControlPoint(points[0], styles.points.JOINT));
    for (let i = 1; i < points.length; i += 3) {
      this.points.push(new ControlPoint(points[i], styles.points.SKEWER));
      this.points.push(new ControlPoint(points[i+1], styles.points.SKEWER));
      this.points.push(new ControlPoint(points[i+2], styles.points.JOINT));
    }
  }

  abstract draw(ctx: Conte): void;

  catch(v: V2): ControlPoint|undefined {
    for (let p of this.points) {
      if (p.caughtBy(v)) {
        return p;
      }
    }
    return undefined
  }
}