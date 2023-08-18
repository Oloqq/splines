import { App as AppTemplate } from "./lib/app";
import { V2 } from "./lib/vector";
import { ControlPoint, Spline, BezierSpline } from "./splines";
import styles from "./style";

export class App extends AppTemplate {
  splines: Spline[] = [];
  grip: ControlPoint[] = [];
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

  changeGrip(newGrip: ControlPoint[]) {
    console.log(`old grip ${this.grip.toString()}`);
    for (let g of this.grip) {
      g.active = false;
    }
    this.grip = newGrip;
    for (let g of this.grip) {
      g.active = true;
    }
    console.log(`new grip ${this.grip.toString()}`);
  }

  mouseup(pos: V2) {}

  mousedown(pos: V2) {
    let found = false;
    for (let [i, spline] of this.splines.entries()) {
      let grip = spline.catch(pos);
      if (grip !== undefined) {
        this.activate(i);
        this.changeGrip([grip]);
        found = true;
        break;
      }
    }
    if (found === false) this.changeGrip([]);
    console.log(found);
  }

  mousemove(pos: V2, drag: boolean = false) {
    if (drag && this.grip.length > 0) {
      let diff = pos.sub(this.grip[0]);
      for (let g of this.grip) {
        g.incr(diff);
      }
    }
  }

  causeError() {
    // console.log("causing error");
    // this.obj = undefined;
  }
}