import { SHAPES } from './constants';

const USE_CIRCLE_APPROXIMATION = false;

export class Physics {
  
  /*  Checks if objA is touching objB.
      If true, returns the corrected coordinates for objA and objB, in form:
        { ax, ay, bx, by }
      If false, returns null.
   */
  static checkCollision (objA, objB) {
    return null;
  }
  
  static dotProduct (vectorA, vectorB) {
    if (!vectorA || !vectorB) return null;
    return vectorA.x * vectorB.x + vectorA.y * vectorB.y;
  }

}