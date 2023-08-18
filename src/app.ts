import { Conte, makeConte } from "./lib/conte";
import { V2 } from "./lib/vector";
import { Spline, BezierSpline } from "./splines";
import { styles } from "./style";


export class App {
  canvas: HTMLCanvasElement;
  ctx: Conte;

  splines: Spline[] = [];
  grip: V2|undefined;
  activeSplineId: number|undefined;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = makeConte(canvas.getContext("2d")!);

    this.splines.push(BezierSpline.sample());
    let b2 = new BezierSpline([new V2(100, 700), new V2(140, 500), new V2(180, 500), new V2(420, 700)]);
    this.splines.push(b2);
  }

  run() {
    let drawLoop = () => {
      let t = window.setTimeout(drawLoop, 1000 / 60);
      try {
        this.update();
        this.draw();
      }
      catch (e) {
        clearTimeout(t);
        throw e;
      }
    };
    drawLoop();
  }

  update() {
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

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
      s.style = styles.DEFAULT;
    });
    this.activeSplineId = splineId;
    this.activeSpline((s) => {
      s.style = styles.ACTIVE;
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