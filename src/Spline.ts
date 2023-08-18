import { SplineStyle, styles } from "./style";
import { Conte, V2 } from "./utils";
export { Conte, V2 } from "./utils"; // Re-exports for deriving classes

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
}