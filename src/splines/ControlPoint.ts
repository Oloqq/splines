import styles, { ControlPointStyle } from "../style";
import { V2 } from "../lib/vector";
import { Conte } from "../lib/conte";

const NORMAL_CONTROL_POINT_THICC = 1;
const ACTIVE_CONTROL_POINT_THICC = 3;

export enum Constraint {
  NONE,
  MOVE_WITH_NEIGHBORS,
  ALIGN,
  MIRROR,
  EQUIDIST,
  SKEWER,
}

export class ControlPoint extends V2 {
  style: ControlPointStyle
  active: boolean = false;
  isKnot: boolean;
  constraint: Constraint = Constraint.NONE;

  constructor(pos: V2, isKnot: boolean, constraint: Constraint|undefined = undefined) {
    super(pos.x, pos.y);
    this.isKnot = isKnot;
    if (isKnot) {
      this.style = styles.points.KNOT;
      this.constraint = constraint ?? Constraint.NONE;
    }
    else {
      this.style = styles.points.SKEWER;
      this.constraint = Constraint.SKEWER;
    }
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

  requires(con: Constraint): boolean {
    return this.constraint === con;
  }
}