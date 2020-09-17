import Coordinate3 from '../coordinate/Coordinate3'

export default class Coordinate4 extends Coordinate3 {
    constructor(x, y, z, w) {
        super(x, y, z);
        this.w = w;
    }

    getW() { return this.w; }
    setW(w) { this.w = w; }
    set(x, y, z, w) {
        super.set(x, y, z);
        this.setW(w);
    }
    setC(coordinate4) {
        this.set(
            coordinate4.getX(),
            coordinate4.getY(),
            coordinate4.getZ(),
            coordinate4.getw()
        );
    }

    addW(val) { this.setW(this.getW() + val) };
    add(val) {
        super.add(val);
        this.addW(val);
    }
    addC(coordinate4) {
        super.add(coordinate4);
        this.addW(coordinate4.getW());
    }

    subtractW(val) { this.addW(-val) };
    subtract(val) {
        super.subtract(val);
        this.subtractW(val);
    }
    subtractC(coordinate4) {
        super.subtract(coordinate4);
        this.subtractW(coordinate4.getW());
    }

    divideW(val) { this.setW(this.getW() / val); }
    divide(val) {
        super.divide(val);
        this.divideW(val);
    }
    divideC(coordinate4) {
        super.divide(coordinate4);
        this.divideW(coordinate4.getW());
    }

    multiplyW(val) { this.setW(this.getW() * val); }
    multiply(val) {
        super.multiply(val);
        this.multiplyW(val);
    }
    multiplyC(coordinate4) {
        super.multiply(coordinate4);
        this.multiplyW(coordinate4.getW());
    }

    equals(coordinate4) {
        return coordinate4.getX() === this.getX()
            && coordinate4.getY() === this.getY()
            && coordinate4.getZ() === this.getZ()
            && coordinate4.getW() === this.getW();
    }
}