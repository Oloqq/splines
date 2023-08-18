export class V2 {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  add(v: V2): V2 {
    return new V2(this.x + v.x, this.y + v.y);
  }

  sub(v: V2): V2 {
    return new V2(this.x - v.x, this.y - v.y);
  }
}

type StyledDrawFunc = (styleFunc: (ctx: Conte) => void, drawFunc: () => void) => void

export interface Conte extends CanvasRenderingContext2D {
  // Styling
  withStyle: StyledDrawFunc;
  styledStroke: StyledDrawFunc;

  // Vector based drawing
  vmoveTo: (v: V2) => void;
  vlineTo: (v: V2) => void;
  vbezierTo: (v1: V2, v2: V2, v3: V2) => void;

  // Transformations
  translation: V2;
  vtranslate: (v: V2) => void;
  canvsasToWorld: (v: V2) => V2;
}
export function makeConte(ctx: CanvasRenderingContext2D): Conte {
  let c = ctx as Conte;
  c.withStyle = function (styleFunc: any, drawFunc: any) {
    this.save();
    styleFunc(this);
    drawFunc();
    this.restore();
  }
  c.styledStroke = function (styleFunc: any, drawFunc: any) {
    this.save();
    styleFunc(this);
    this.beginPath();
    drawFunc();
    this.stroke();
    this.restore();
  }

  c.vmoveTo = function (v: V2) {
    this.moveTo(v.x, v.y);
  }
  c.vlineTo = function (v: V2) {
    this.lineTo(v.x, v.y);
  }
  c.vbezierTo = function (v1: V2, v2: V2, v3: V2) {
    this.bezierCurveTo(v1.x, v1.y, v2.x, v2.y, v3.x, v3.y);
  }

  c.translation = new V2(0, 0);
  c.vtranslate = function (v: V2) {
    this.translate(v.x, v.y);
    this.translation = this.translation.add(v);
  }
  c.canvsasToWorld = function (v: V2): V2 {
    return v.sub(this.translation);
  }

  return c;
}

