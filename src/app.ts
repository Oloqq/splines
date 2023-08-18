import { App as AppTemplate } from "./lib/app";
import { V2 } from "./lib/vector";
import { ControlPoint, Spline, BezierSpline } from "./splines";
import styles from "./style";

const DUMMY = new ControlPoint(new V2(0, 0), styles.points.JOINT);

class Grip {
  points: Set<ControlPoint> = new Set();
  anchor: ControlPoint = DUMMY;

  clear() {
    for (let g of this.points) {
      g.active = false;
    }
    this.anchor = DUMMY;
    this.points.clear();
  }

  expand(point: ControlPoint) {
    point.active = true;
    this.points.add(point);
    this.anchor = point;
  }

  drag(pos: V2) {
    let diff = pos.sub(this.anchor);
    for (let g of this.points) {
      g.incr(diff);
    }
  }
}

export class App extends AppTemplate {
  splines: Spline[] = [];
  grip: Grip = new Grip();
  activeSplineId: number|undefined;

  constructor(canvas: HTMLCanvasElement) {
    super(canvas);

    this.splines.push(BezierSpline.sample());
    let b2 = new BezierSpline([
      new V2(100, 700),
      new V2(140, 500),
      new V2(180, 500),
      new V2(420, 700)
      ])
      .prepend([new V2(100, 300), new V2(0, 300), new V2(400, 200)])
      .append([new V2(420, 750), new V2(640, 500), new V2(680, 500)])
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

  catchAt(pos: V2, appendGrip: boolean, dry = false): [number|undefined, ControlPoint|undefined] {
    let ispline: number, spline: Spline
    for ([ispline, spline] of this.splines.entries()) {
      let gripped = spline.catch(pos);
      if (gripped !== undefined) {
        if (!dry) {
          this.activate(ispline);
          if (!appendGrip) this.grip.clear();
          this.grip.expand(gripped);
        }
        return [ispline, gripped];
      }
    }
    if (!dry && !appendGrip) this.grip.clear();
    return [undefined, undefined];
  }

  mouseup(pos: V2, more: MouseEvent) {}

  mousedown(pos: V2, more: MouseEvent) {
    this.catchAt(pos, more.ctrlKey);
  }

  mousemove(pos: V2, more: MouseEvent, drag: boolean = false) {
    if (drag) this.grip.drag(pos);
  }

  causeError() {
    // console.log("causing error");
    // this.obj = undefined;
  }
}