import GameObject from "./GameObject";
import CoordinatesMap from "../core/coordinate/CoordinatesMap";

export default class Landscape extends GameObject {
  constructor(x, y, z, width, height) {
    super(x, y, z);
    this.height = height;
    this.width = width;
    this.mesh = new CoordinatesMap(
      this.generateVertices(),
      this.generateFaces()
    );
  }

  getVerticesIndex(x, y) {
    return x + y * (this.width + 1);
  }

  generateVertices() {
    const vertices = new Float32Array((this.width + 1) * (this.height + 1) * 3);

    let verticesCount = 0;
    for (let x = 0; x <= this.width; x++) {
      for (let z = 0; z <= this.height; z++) {
        vertices[verticesCount++] = x;
        vertices[verticesCount++] = 0;
        vertices[verticesCount++] = z;
      }
    }

    return vertices;
  }

  generateFaces() {
    const faces = new Uint16Array(this.width * this.height * 6);

    let facesCount = 0;
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        faces[facesCount++] = this.getVerticesIndex(x, y);
        faces[facesCount++] = this.getVerticesIndex(x + 1, y);
        faces[facesCount++] = this.getVerticesIndex(x, y + 1);

        faces[facesCount++] = this.getVerticesIndex(x, y + 1);
        faces[facesCount++] = this.getVerticesIndex(x + 1, y);
        faces[facesCount++] = this.getVerticesIndex(x + 1, y + 1);
      }
    }

    return faces;
  }
}
