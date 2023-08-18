import { ControlPointStyle } from "../style";
import { V2 } from "../lib/vector";
import { Conte } from "../lib/conte";

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