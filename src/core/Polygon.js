export default class Polygon {
  constructor(p1, p2, p3, uv1, uv2, uv3, texture) {
    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3;

    this.uv1 = uv1;
    this.uv2 = uv2;
    this.uv3 = uv3;

    this.texture = texture;
  }

  static baricentricValues(x, y, p1, p2, p3) {
    const dy23 = p2.y - p3.y;
    const dx32 = p3.x - p2.x;
    const dx13 = p1.x - p3.x;
    const dy31 = p3.y - p1.y;
    const dy13 = p1.y - p3.y;

    const b = (dy23 * dx13) + (dx32 * dy13);
    const bx = x - p3.x;
    const by = y - p3.y;
    const w1 = ((dy23 * bx) + (dx32 * by)) / b;
    const w2 = ((dy31 * bx) + (dx13 * by)) / b;
    const w3 = 1 - w1 - w2;

    return [w1, w2, w3];
  }

  baricentricValues(x, y) {
    return Polygon.baricentricValues(x, y, this.p1, this.p2, this.p3);
  }
}