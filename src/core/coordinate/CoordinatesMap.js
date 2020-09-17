export default class CoordinatesMap {
  constructor(coordinates, map) {
    this.coordinates = coordinates;
    this.map = map;
  }

  getLength() {
    return this.map.length;
  }

  get(mapIndex) {
    return this.coordinates[this.map[mapIndex]];
  }
}
