import { Spline, Conte, V2 } from "./Spline";

export class BezierSpline extends Spline {
  constructor(points: V2[]) {
    super(points);
  }

  static sample(): BezierSpline {
    return new BezierSpline([new V2(100, 200), new V2(140, 100), new V2(180, 100), new V2(420, 200)]);
  }

  draw(ctx: Conte): void {
    let draw_node = (at: V2, r: number) => {
      ctx.beginPath();
      ctx.arc(at.x, at.y, r, 0, 2 * Math.PI);
      ctx.stroke();
    }

    for (let i = 0; i < this.points.length - 1; i += 3) {
      ctx.styledStroke(this.style.curve, () => {
        ctx.vmoveTo(this.points[i]);
        ctx.vbezierTo(this.points[i+1], this.points[i+2], this.points[i+3]);
      });
      ctx.withStyle(this.style.joints, () => {
        draw_node(this.points[i], 20);
        draw_node(this.points[i+1], 10);
        draw_node(this.points[i+2], 10);
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
    ctx.withStyle(this.style.joints, () => {
      draw_node(this.points[this.points.length - 1], 20);
    });
  }
}