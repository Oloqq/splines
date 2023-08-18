import { Spline, Conte, V2 } from "./Spline";

export class BezierSpline extends Spline {
  constructor(points: V2[]) {
    super(points);
  }

  static sample(): BezierSpline {
    return new BezierSpline([new V2(200, 200), new V2(240, 160), new V2(280, 160), new V2(320, 200)]);
  }

  draw(ctx: Conte): void {
    for (let i = 0; i < this.points.length - 1; i += 3) {
      let [p1, p2, p3, p4] = [this.points[i], this.points[i+1], this.points[i+2], this.points[i+3]];
      ctx.styledStroke(this.style.curve, () => {
        ctx.vMoveTo(p1);
        ctx.vBezierTo(p2, p3, p4);
      });
    }
  }
}