import styles, { ControlPointStyle } from "../style";
import { V2 } from "../lib/vector";
import { Conte } from "../lib/conte";

const NORMAL_CONTROL_POINT_THICC = 1;
const ACTIVE_CONTROL_POINT_THICC = 3;

export enum Constraints {
  NONE                = 0,
  MOVE_WITH_NEIGHBORS = 1 << 0,
  _                   = 1 << 1,
  ALIGN               = 1 << 2,
  MIRROR              = 1 << 3,
}

export enum PointRole {
  KNOT, LEFT, RIGHT
}

export class ControlPoint extends V2 {
  style: ControlPointStyle
  active: boolean = false;
  joint: boolean;
  constraints: Constraints = Constraints.NONE;

  constructor(pos: V2, joint: boolean) {
    super(pos.x, pos.y);
    this.joint = joint;
    this.style = joint ? styles.points.JOINT : styles.points.SKEWER;
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

  requires(con: Constraints): boolean {
    return (con & this.constraints) === con;
  }
}