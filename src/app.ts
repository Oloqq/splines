import { App as AppTemplate } from "./lib/app";
import { V2 } from "./lib/vector";
import { Spline, BezierSpline } from "./splines";
import styles from "./style";

export class App extends AppTemplate {
  splines: Spline[] = [];
  grip: V2|undefined;
  activeSplineId: number|undefined;

  constructor(canvas: HTMLCanvasElement) {
    super(canvas);

    this.splines.push(BezierSpline.sample());
    let b2 = new BezierSpline([new V2(100, 700), new V2(140, 500), new V2(180, 500), new V2(420, 700)]);
    this.splines.push(b2);
  }

  draw() {
    for (let spline of this.splines) {
      spline.draw(this.ctx);
    }
  }

  activeSpline(action: (spline: Spline) => void): Spline|undefined {
    if (this.activeSplineId !== undefined) {
      let spline = this.splines[this.activeSplineId];
      action(spline);
      return spline
    }
    return undefined;
  }

  activate(splineId: number) {
    this.activeSpline((s) => {
      s.style = styles.splines.DEFAULT;
    });
    this.activeSplineId = splineId;
    this.activeSpline((s) => {
      s.style = styles.splines.ACTIVE;
    });
  }

  mouseup(pos: V2) {
    this.grip = undefined;
  }

  mousedown(pos: V2) {
    for (let [i, spline] of this.splines.entries()) {
      let grip = spline.catch(pos);
      if (grip !== undefined) {
        this.activate(i);
        this.grip = grip;
        break;
      }
    }
  }

  mousemove(pos: V2) {
    if (this.grip !== undefined) {
      this.grip.x = pos.x;
      this.grip.y = pos.y;
    }
  }

  causeError() {
    // console.log("causing error");
    // this.obj = undefined;
  }
}