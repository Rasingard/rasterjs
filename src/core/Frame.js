import { Color, Polygon } from "./Engine";

export default class Frame {
  constructor(width, height) {
    const frame = new ImageData(width, height);
    const zBuffer = new Float32Array(width * height);
    const buffer = new ArrayBuffer(frame.data.length);
    const buffer8 = new Uint8ClampedArray(buffer);
    const buffer32 = new Uint32Array(buffer);

    this.getHeight = () => height;
    this.getWidth = () => width;

    this.index = (x, y) => x + y * width;

    this.getData = () => {
      frame.data.set(buffer8);
      return frame;
    }

    this.set32 = (x, y, color) => {
      const i = this.index(x, y);
      buffer32[i] = (255 << 24) | (color.getB() << 16) | (color.getG() << 8) | color.getR();
      zBuffer[i] = Number.MIN_VALUE;
    }

    this.setZ32 = (x, y, z, color) => {
      const i = this.index(x, y);

      if(!zBuffer[i] || zBuffer[i] > z) {
        buffer32[i] = (255 << 24) | (color.getB() << 16) | (color.getG() << 8) | color.getR();
        zBuffer[i] = z;
      }
    }
  }

  drawLine(x0, y0, x1, y1, color) {
    let dx = Math.abs(x1 - x0),
      sx = x0 < x1 ? 1 : -1,
      dy = Math.abs(y1 - y0),
      sy = y0 < y1 ? 1 : -1,
      err = (dx > dy ? dx : -dy) / 2,
      e2 = err;

    while (true) {
      if (x0 >= 0 && x0 < this.getWidth() - 1 && y0 >= 0 && y0 < this.getHeight() - 1) {
        this.set32(x0, y0, color);
      }

      if (x0 === x1 && y0 === y1) break;

      e2 = err;

      if (e2 > -dx) {
        err -= dy;
        x0 += sx;
      }

      if (e2 < dy) {
        err += dx;
        y0 += sy;
      }
    }
  }

  clampX(val, width) {
    return Math.max(Math.min(val, width - 1), 0);
  }

  renderPoly(poly, transform) {
    let
      p1 = poly.p1.get(),
      p2 = poly.p2.get(),
      p3 = poly.p3.get();

    transform.transform3D(p1);
    transform.transform3D(p2);
    transform.transform3D(p3);

    if (p1.z < 0.1 || p2.z < 0.1 || p3.z < 0.1) return;

    const w2 = this.getWidth() * 0.5;
    const h2 = this.getHeight() * 0.5;

    p1.x = w2 + (p1.x * this.getWidth()) / p1.z;
    p1.y = h2 + (p1.y * this.getWidth()) / p1.z;
    p2.x = w2 + (p2.x * this.getWidth()) / p2.z;
    p2.y = h2 + (p2.y * this.getWidth()) / p2.z;
    p3.x = w2 + (p3.x * this.getWidth()) / p3.z;
    p3.y = h2 + (p3.y * this.getWidth()) / p3.z;

    let delta, px, py, iuv, c = Color.WHITE.getCopy();

    this.eachPolyPixel(p1, p2, p3, (x, y, z) => {
      delta = Polygon.baricentricValues(x, y, p1, p2, p3);
      px = Math.round(((poly.uv1.x * delta[0]) + (poly.uv2.x * delta[1]) + (poly.uv3.x * delta[2])) * poly.texture.width);
      py = poly.texture.height - Math.round(((poly.uv1.y * delta[0]) + (poly.uv2.y * delta[1]) + (poly.uv3.y * delta[2])) * poly.texture.height);
      iuv = (px + py * poly.texture.width) * 4;
      c.r = poly.texture.data[iuv];
      c.g = poly.texture.data[iuv + 1];
      c.b = poly.texture.data[iuv + 2];

      this.setZ32(x, y, z, c);

      // this.setZ32(x, y, z, c.getCopy().shift(2 / z));
    });
  }

  interpolateLine(
    p1x,
    p1z,
    p2x,
    p2z,
    y,
    fn
  ) {
    if((p1x < 0 && p2x < 0) || (p1x >= this.getWidth() && p2x >= this.getWidth())) return;

    let
      x0 = p1x,
      x1 = p2x,
      z0 = p1z,
      z1 = p2z;

    if(p1x > p2x) {
      x0 = p2x;
      x1 = p1x;
      z0 = p2z;
      z1 = p1z;
    }

    const zDelta = z1 - z0;
    const xDelta = x1 - x0;
    const zStep = xDelta !== 0 ? zDelta / xDelta : 0;
    let z = z0;

    for (x0; x0 <= x1; x0++) {
      if(x0 >= 0 && x0 < this.getWidth()) fn(x0, y, z);
      z += zStep;
    }
  }

  eachPolyPixel(p1, p2, p3, fn) {
    if (p1.y > p2.y) {
      const t = p1;
      p1 = p2;
      p2 = t;
    }

    if (p1.y > p3.y) {
      const t = p1;
      p1 = p3;
      p3 = t;
    }

    if (p2.y > p3.y) {
      const t = p2;
      p2 = p3;
      p3 = t;
    }

    const deltaX13 = p3.x - p1.x;
    const s13 = deltaX13 !== 0 ? deltaX13 / (p3.y - p1.y) : 0;
    const stepX13 = Math.floor(s13);
    const stepErr13 = Math.abs(s13 - Math.floor(s13));

    const deltaX12 = p2.x - p1.x;
    const s12 = deltaX12 !== 0 ? deltaX12 / (p2.y - p1.y) : 0;
    const stepX12 = Math.floor(s12);
    const stepErr12 = Math.abs(s12 - Math.floor(s12));

    const deltaY12 = p2.y - p1.y;
    const deltaY13 = p3.y - p1.y;

    const deltaZ13 = p3.z - p1.z; // Z 1 > 3
    const stepZ13 = deltaY13 !== 0 ? deltaZ13 / deltaY13 : 0;

    const deltaZ12 = p2.z - p1.z; // Z 1 > 2
    const stepZ12 = deltaY12 !== 0 ? deltaZ12 / deltaY12 : 0;

    let y = Math.floor(p1.y);
    let y2 = Math.floor(p2.y);
    let x12 = Math.floor(p1.x);
    let x13 = Math.floor(p1.x);
    let x12err = stepErr12;
    let x13err = stepErr13;

    let z12 = p1.z;
    let z13 = z12;

    for (; y < y2; y++) {
      if (y >= 0 && y < this.getHeight()) {
        this.interpolateLine(x12, z12, x13, z13, y, fn);
      }

      x12 += stepX12;
      x13 += stepX13;
      x12err += stepErr12;
      x13err += stepErr13;

      z12 += stepZ12;
      z13 += stepZ13;

      if (x12err >= 1) {
        x12 += 1;
        x12err -= 1;
      }

      if (x13err >= 1) {
        x13 += 1;
        x13err -= 1;
      }
    }

    const deltaX23 = p3.x - p2.x;
    const s23 = deltaX23 !== 0 ? deltaX23 / (p3.y - p2.y) : 0;
    const stepX23 = Math.floor(s23);
    const stepErr23 = Math.abs(s23 - Math.floor(s23));

    const deltaY23 = p3.y - p2.y;

    const deltaZ23 = p3.z - p2.z; // Z 2 > 3
    const stepZ23 = deltaY23 !== 0 ? deltaZ23 / deltaY23 : 0;

    let y3 = Math.floor(p3.y);
    let x23 = Math.floor(p2.x);
    let x23err = stepErr23;

    let z23 = p2.z;

    for (; y2 < y3; y2++) {
      if (y2 >= 0 && y2 < this.getHeight()) {
        this.interpolateLine(x23, z23, x13, z13, y2, fn);
      }

      x23 += stepX23;
      x13 += stepX13;
      x23err += stepErr23;
      x13err += stepErr13;

      z23 += stepZ23;
      z13 += stepZ13;

      if (x23err >= 1) {
        x23 += 1;
        x23err -= 1;
      }

      if (x13err >= 1) {
        x13 += 1;
        x13err -= 1;
      }
    }
  }
}