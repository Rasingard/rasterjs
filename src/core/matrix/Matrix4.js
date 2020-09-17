export default class Matrix4 {
  constructor() {
    this.data = new Float32Array(16);

    this.get00 = () => this.data[0];
    this.get01 = () => this.data[1];
    this.get02 = () => this.data[2];
    this.get03 = () => this.data[3];
    this.get10 = () => this.data[4];
    this.get11 = () => this.data[5];
    this.get12 = () => this.data[6];
    this.get13 = () => this.data[7];
    this.get20 = () => this.data[8];
    this.get21 = () => this.data[9];
    this.get22 = () => this.data[10];
    this.get23 = () => this.data[11];
    this.get30 = () => this.data[12];
    this.get31 = () => this.data[13];
    this.get32 = () => this.data[14];
    this.get33 = () => this.data[15];

    this.set00 = val => (this.data[0] = val);
    this.set01 = val => (this.data[1] = val);
    this.set02 = val => (this.data[2] = val);
    this.set03 = val => (this.data[3] = val);
    this.set10 = val => (this.data[4] = val);
    this.set11 = val => (this.data[5] = val);
    this.set12 = val => (this.data[6] = val);
    this.set13 = val => (this.data[7] = val);
    this.set20 = val => (this.data[8] = val);
    this.set21 = val => (this.data[9] = val);
    this.set22 = val => (this.data[10] = val);
    this.set23 = val => (this.data[11] = val);
    this.set30 = val => (this.data[12] = val);
    this.set31 = val => (this.data[13] = val);
    this.set32 = val => (this.data[14] = val);
    this.set33 = val => (this.data[15] = val);

    this.getBuffer = () => this.data.buffer;
  }

  printTable() {
    console.table([
      [
        "l0c0: " + this.get00(),
        "l0c1: " + this.get01(),
        "l0c2: " + this.get02(),
        "l0c3: " + this.get03()
      ],
      [
        "10: " + this.get10(),
        "11: " + this.get11(),
        "12: " + this.get12(),
        "13: " + this.get13()
      ],
      [
        "20: " + this.get20(),
        "21: " + this.get21(),
        "22: " + this.get22(),
        "23: " + this.get23()
      ],
      [
        "30: " + this.get30(),
        "31: " + this.get31(),
        "32: " + this.get32(),
        "33: " + this.get33()
      ]
    ]);
  }

  setL0(coord3) {
    this.set00(coord3.getX());
    this.set01(coord3.getY());
    this.set02(coord3.getZ());
  }

  setL1(coord3) {
    this.set10(coord3.getX());
    this.set11(coord3.getY());
    this.set12(coord3.getZ());
  }

  setL2(coord3) {
    this.set20(coord3.getX());
    this.set21(coord3.getY());
    this.set22(coord3.getZ());
  }

  setL3(coord3) {
    this.set30(coord3.getX());
    this.set31(coord3.getY());
    this.set32(coord3.getZ());
  }

  setC0(coord3) {
    this.set00(coord3.getX());
    this.set10(coord3.getY());
    this.set20(coord3.getZ());
  }

  setC1(coord3) {
    this.set01(coord3.getX());
    this.set11(coord3.getY());
    this.set21(coord3.getZ());
  }

  setC2(coord3) {
    this.set02(coord3.getX());
    this.set12(coord3.getY());
    this.set22(coord3.getZ());
  }

  setC3(coord3) {
    this.set03(coord3.getX());
    this.set13(coord3.getY());
    this.set23(coord3.getZ());
  }

  transform3D(coord3) {
    const x = coord3.getX();
    const y = coord3.getY();
    const z = coord3.getZ();

    coord3.setX(
      x * this.get00() + y * this.get10() + z * this.get20() + this.get30()
    );
    coord3.setY(
      x * this.get01() + y * this.get11() + z * this.get21() + this.get31()
    );
    coord3.setZ(
      x * this.get02() + y * this.get12() + z * this.get22() + this.get32()
    );
  }

  transform3D2(coord3) {
    const x = coord3.getX();
    const y = coord3.getY();
    const z = coord3.getZ();

    coord3.setX(
      x * this.get00() + y * this.get10() + z * this.get20() + this.get30()
    );
    coord3.setY(
      x * this.get01() + y * this.get11() + z * this.get21() + this.get31()
    );
    coord3.setZ(
      x * this.get02() + y * this.get12() + z * this.get22() + this.get32()
    );

    const w =
      x * this.get03() + y * this.get13() + z * this.get23() + this.get33();

    if (w !== 0) coord3.divide(w);
  }

  getInverse() {
    const newMatrix = new Matrix4();

    // Transpose X
    newMatrix.set00(this.get00());
    newMatrix.set10(this.get01());
    newMatrix.set20(this.get02());
    newMatrix.set03(0);

    // Transpose Y
    newMatrix.set01(this.get10());
    newMatrix.set11(this.get11());
    newMatrix.set21(this.get12());
    newMatrix.set13(0);

    // Transpose Z
    newMatrix.set02(this.get20());
    newMatrix.set22(this.get21());
    newMatrix.set12(this.get22());
    newMatrix.set23(0);

    // Invert  Transpose
    newMatrix.set30(-this.get30());
    newMatrix.set31(-this.get31());
    newMatrix.set32(-this.get32());
    newMatrix.set33(1);

    return newMatrix;
  }

  static uniformScale(scalar) {
    const matrix = new Matrix4();
    matrix.set00(scalar);
    matrix.set11(scalar);
    matrix.set22(scalar);
    matrix.set33(1);

    return matrix;
  }

  static translationMatrix(x, y, z) {
    const matrix = new Matrix4();
    matrix.set00(1);
    matrix.set11(1);
    matrix.set22(1);
    matrix.set03(x);
    matrix.set13(y);
    matrix.set23(z);
    matrix.set33(1);

    return matrix;
  }

  static tranformation(xVec3, yVec3, zVec3, originPoint3) {
    const newMatrix = new Matrix4();

    newMatrix.setL0(xVec3);
    newMatrix.setL1(yVec3);
    newMatrix.setL2(zVec3);
    newMatrix.setL3(originPoint3);
    newMatrix.set33(1);

    return newMatrix;
  }

  static invertTransformation(xVec3, yVec3, zVec3, originPoint3) {
    const newMatrix = new Matrix4();

    newMatrix.setC0(xVec3);
    newMatrix.setC1(yVec3);
    newMatrix.setC2(zVec3);
    newMatrix.set30(
      -originPoint3.getX() * xVec3.getX() +
        -originPoint3.getY() * xVec3.getY() +
        -originPoint3.getZ() * xVec3.getZ()
    );
    newMatrix.set31(
      -originPoint3.getX() * yVec3.getX() +
        -originPoint3.getY() * yVec3.getY() +
        -originPoint3.getZ() * yVec3.getZ()
    );
    newMatrix.set32(
      -originPoint3.getX() * zVec3.getX() +
        -originPoint3.getY() * zVec3.getY() +
        -originPoint3.getZ() * zVec3.getZ()
    );
    newMatrix.set33(1);

    return newMatrix;
  }

  static perspective(height, width, near, far, fov) {
    const newMatrix = new Matrix4();
    const s = 1 / Math.tan((fov * 0.5 * Math.PI) / 180);

    newMatrix.set00((height / width) * s);
    newMatrix.set11(s);
    newMatrix.set22(-far / (far - near));
    newMatrix.set23((-far * near) / (far - near));
    newMatrix.set32(-1);

    return newMatrix;
  }

  static projection(height, width, near, far, fov) {
    const newMatrix = new Matrix4();
    const s = 1 / Math.tan(0.5 * Math.PI);

    newMatrix.set00((height / width) * s);
    newMatrix.set11(s);
    newMatrix.set22(far / (far - near));
    newMatrix.set23((-far * near) / (far - near));
    newMatrix.set32(-1);

    return newMatrix;
  }
}
