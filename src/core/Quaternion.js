import Coordinate4 from "../core/coordinate/Coordinate4";
import Vector3 from "../core/vector/Vector3";
import Matrix4 from "./matrix/Matrix4";

export default class Quaternion extends Coordinate4 {
  constructor(x, y, z, w) {
    super(x, y, z, w);
  }

  static fromAxisAngle(axis_vector3, angle) {
    const radians = angle * (Math.PI / 180);
    const s = Math.sin(radians / 2);

    return new Quaternion(
      axis_vector3.getX() * s,
      axis_vector3.getY() * s,
      axis_vector3.getZ() * s,
      Math.cos(radians / 2)
    );
  }

  getVector3() {
    return new Vector3(this.getX(), this.getY(), this.getZ());
  }

  getLength() {
    return Math.sqrt(
      Math.pow(this.getX(), 2) +
        Math.pow(this.getY(), 2) +
        Math.pow(this.getZ(), 2) +
        Math.pow(this.getW(), 2)
    );
  }

  normalize() {
    this.divide(this.getLength());
  }

  multiply(quaternion) {
    const tempW =
      this.getW() * quaternion.getW() -
      this.getX() * quaternion.getX() -
      this.getY() * quaternion.getY() -
      this.getZ() * quaternion.getZ();
    const tempX =
      this.getW() * quaternion.getX() +
      this.getX() * quaternion.getW() +
      this.getY() * quaternion.getZ() -
      this.getZ() * quaternion.getY();
    const tempY =
      this.getW() * quaternion.getY() -
      this.getX() * quaternion.getZ() +
      this.getY() * quaternion.getW() +
      this.getZ() * quaternion.getX();
    const tempZ =
      this.getW() * quaternion.getZ() +
      this.getX() * quaternion.getY() -
      this.getY() * quaternion.getX() +
      this.getZ() * quaternion.getW();

    this.set(tempW, tempX, tempY, tempZ);
  }

  rotateVector_old(vector3) {
    const _w2 = Math.pow(this.getW(), 2);
    const _x2 = Math.pow(this.getX(), 2);
    const _y2 = Math.pow(this.getY(), 2);
    const _z2 = Math.pow(this.getZ(), 2);
    const _2xy = 2 * this.getX() * this.getY();
    const _2wz = 2 * this.getZ() * this.getW();
    const _2xz = 2 * this.getX() * this.getZ();
    const _2wy = 2 * this.getY() * this.getW();
    const _2yz = 2 * this.getY() * this.getZ();
    const _2wx = 2 * this.getX() * this.getW();

    const tempX =
      vector3.getX() * (_w2 + _x2 - _y2 - _z2) +
      vector3.getY() * (_2xy + _2wz) +
      vector3.getZ() * (_2xz - _2wy);

    const tempY =
      vector3.getX() * (_2xy - _2wz) +
      vector3.getY() * (_w2 - _x2 + _y2 - _z2) +
      vector3.getZ() * (_2yz + _2wx);

    const tempZ =
      vector3.getX() * (_2xz + _2wy) +
      vector3.getY() * (_2yz - _2wx) +
      vector3.getZ() * (_w2 - _x2 - _y2 + _z2);

    vector3.set(tempX, tempY, tempZ);
  }

  rotateVector(v) {
    //   2 * dot(u, v) * u
    // + (s*s - dot(u, u)) * v
    // + 2 * s * cross(u, v);

    const u = this.getVector3(); // quaternion vector
    const s = this.getW(); // quaternion scalar

    const dotUV = u.getDotC(v);
    const dotUU = u.getDotC(u);
    const crossUV = u.getCrossC(v);

    u.multiply(dotUV * 2); // 2 * dot(u, v) * u
    v.multiply(Math.pow(s, 2) - dotUU); // (s*s - dot(u, u)) * v
    crossUV.multiply(2 * s); // 2 * s * cross(u, v)

    v.addC(crossUV);
  }

  rotationM4(point3) {
    const m4 = new Matrix4();
    const _w2 = Math.pow(this.getW(), 2);
    const _x2 = Math.pow(this.getX(), 2);
    const _y2 = Math.pow(this.getY(), 2);
    const _z2 = Math.pow(this.getZ(), 2);
    const _2xy = 2 * this.getX() * this.getY();
    const _2wz = 2 * this.getZ() * this.getW();
    const _2xz = 2 * this.getX() * this.getZ();
    const _2wy = 2 * this.getY() * this.getW();
    const _2yz = 2 * this.getY() * this.getZ();
    const _2wx = 2 * this.getX() * this.getW();

    m4.set00(_w2 + _x2 - _y2 - _z2);
    m4.set01(_2xy + _2wz);
    m4.set02(_2xz - _2wy);

    m4.set11(_2xy - _2wz);
    m4.set11(_w2 - _x2 + _y2 - _z2);
    m4.set12(_2yz + _2wx);

    m4.set20(_2xz + _2wy);
    m4.set21(_2yz - _2wx);
    m4.set22(_w2 - _x2 - _y2 + _z2);

    m4.set33(1);

    if (point3) {
      m4.set03(
        point3.getX() -
          point3.getX() * m4.get00() -
          point3.getY() * m4.get01() -
          point3.getZ() * m4.get02()
      );

      m4.set13(
        point3.getY() -
          point3.getX() * m4.get10() -
          point3.getY() * m4.get11() -
          point3.getZ() * m4.get12()
      );

      m4.set23(
        point3.getZ() -
          point3.getX() * m4.get20() -
          point3.getY() * m4.get21() -
          point3.getZ() * m4.get22()
      );
    }

    return m4;
  }

  matrixRotation_old(point) {
    const _w2 = Math.pow(this.w, 2);
    const _x2 = Math.pow(this.x, 2);
    const _y2 = Math.pow(this.y, 2);
    const _z2 = Math.pow(this.z, 2);
    const _2xy = 2 * this.x * this.y;
    const _2wz = 2 * this.z * this.w;
    const _2xz = 2 * this.x * this.z;
    const _2wy = 2 * this.y * this.w;
    const _2yz = 2 * this.y * this.z;
    const _2wx = 2 * this.x * this.w;

    const _matrix = [
      [_w2 + _x2 - _y2 - _z2, _2xy + _2wz, _2xz - _2wy, 0],
      [_2xy - _2wz, _w2 - _x2 + _y2 - _z2, _2yz + _2wx, 0],
      [_2xz + _2wy, _2yz - _2wx, _w2 - _x2 - _y2 + _z2, 0],
      [0, 0, 0, 1]
    ];

    if (point) {
      _matrix[0][3] =
        point.x -
        point.x * _matrix[0][0] -
        point.y * _matrix[0][1] -
        point.z * _matrix[0][2];
      _matrix[1][3] =
        point.y -
        point.x * _matrix[1][0] -
        point.y * _matrix[1][1] -
        point.z * _matrix[1][2];
      _matrix[2][3] =
        point.z -
        point.x * _matrix[2][0] -
        point.y * _matrix[2][1] -
        point.z * _matrix[2][2];
    }

    return _matrix;
  }

  inverse() {
    const _w2 = Math.pow(this.getW(), 2);
    const _x2 = Math.pow(this.getX(), 2);
    const _y2 = Math.pow(this.getY(), 2);
    const _z2 = Math.pow(this.getZ(), 2);

    const t = _w2 + _x2 + _y2 + _z2;

    this.set(
      this.getX() / t,
      -this.getY() / t,
      -this.getZ() / t,
      -this.getW() / t
    );
  }
}
