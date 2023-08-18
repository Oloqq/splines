import { Conte, makeConte, V2 } from "./utils";
import { Spline, BezierSpline } from "./splines";

export class App {
  canvas: HTMLCanvasElement;
  ctx: Conte;

  splines: Spline[] = [];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = makeConte(canvas.getContext("2d")!);

    this.splines.push(BezierSpline.sample());
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

  translate(v: V2) {
    this.ctx.vtranslate(v);
  }

  causeError() {
    // console.log("causing error");
    // this.obj = undefined;
  }
}