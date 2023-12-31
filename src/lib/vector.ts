export class V2 {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  set(v: V2) {
    this.x = v.x;
    this.y = v.y;
  }

  add(v: V2): V2 {
    return new V2(this.x + v.x, this.y + v.y);
  }

  sub(v: V2): V2 {
    return new V2(this.x - v.x, this.y - v.y);
  }

  mul(s: number) {
    return new V2(this.x * s, this.y * s);
  }

  div(s: number) {
    return new V2(this.x / s, this.y / s);
  }

  incr(v: V2) {
    this.x += v.x;
    this.y += v.y;
  }

  decr(v: V2) {
    this.x -= v.x;
    this.y -= v.y;
  }

  distance(v: V2): number {
    return Math.sqrt((this.x - v.x) ** 2 + (this.y - v.y) ** 2);
  }
}