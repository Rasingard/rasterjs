export default class World {
    constructor() {
        this.objects = new Array();
    }

    add(obj3) {
        this.objects.push(obj3);
    }

    getVisibleObjects() {
        return this.objects;
    }
}