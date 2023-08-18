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
  withStyle: StyledDrawFunc
  styledStroke: StyledDrawFunc

  // vMoveTo: (v: V2) => void
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
  return c;
}

