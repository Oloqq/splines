import { ControlPointStyle } from "../style";
import { V2 } from "../lib/vector";
import { Conte } from "../lib/conte";

const NORMAL_CONTROL_POINT_THICC = 1;
const ACTIVE_CONTROL_POINT_THICC = 3;

export enum Constraints {
  NONE      = 0,
  FIX_LEFT  = 1 << 0,
  FIX_RIGHT = 1 << 1,
  ALIGN     = 1 << 2,
  MIRROR    = 1 << 3,
}

export class ControlPoint extends V2 {
  style: ControlPointStyle
  active: boolean = false;
  constraints: Constraints = Constraints.NONE;

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