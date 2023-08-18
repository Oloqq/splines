import { SplineStyle, styles } from "../style";
import { Conte } from "../lib/conte";
import { V2 } from "../lib/vector";

// Re-exports for deriving classes
export { Conte } from "../lib/conte";
export { V2 } from "../lib/vector";


export abstract class Spline {
  points: V2[];
  style: SplineStyle = styles.DEFAULT;

  constructor(points: V2[]) {
    if (points.length % 3 !== 1) {
      throw new Error(`Points vector does not describe a valid spline. Incorrect length: ${points.length}`)
    }
    this.points = points;
  }

  abstract draw(ctx: Conte): void;

  catch(v: V2): V2|undefined {
    for (let p of this.points) {
      if (p.distance(v) < 20) {
        return p;
      }
    }
    return undefined
  }
}