export default class Coordinate2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    getX() { return this.x }
    getY() { return this.y }

    setX(x) { this.x = x }
    setY(y) { this.y = y }
    set(x, y) {
        this.setX(x);
        this.setY(y);
    }
    setC(coordinate2) {
        this.set(
            coordinate2.getX(),
            coordinate2.getY()
        );
    }

    addX(val) { this.setX(this.getX() + val) };
    addY(val) { this.setY(this.getY() + val) };
    add(val) {
        this.addX(val);
        this.addY(val);
    }
    addC(coordinate2) {
        this.addX(coordinate2.getX());
        this.addY(coordinate2.getY());
    }

    subtractX(val) { this.addX(-val) };
    subtractY(val) { this.addY(-val) };
    subtract(val) {
        this.subtractX(val);
        this.subtractY(val);
    }
    subtractC(coordinate2) {
        this.subtractX(coordinate2.getX());
        this.subtractY(coordinate2.getY());
    }

    divideX(val) { this.setX(this.getX() / val); }
    divideY(val) { this.setY(this.getY() / val); }
    divide(val) {
        this.divideX(val);
        this.divideY(val);
    }
    divideC(coordinate2) {
        this.divideX(coordinate2.getX());
        this.divideY(coordinate2.getY());
    }

    multiplyX(val) { this.setX(this.getX() * val); }
    multiplyY(val) { this.setY(this.getY() * val); }
    multiply(val) {
        this.multiplyX(val);
        this.multiplyY(val);
    }
    multiplyC(coordinate2) {
        this.multiplyX(coordinate2.getX());
        this.multiplyY(coordinate2.getY());
    }

    equals(coordinate2) {
        return this.getX() === coordinate2.getX() 
            && this.getY() === coordinate2.getY();
    }
}