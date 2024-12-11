import { Cube } from "./Cube.js";

export class Polygon extends Cube {
    constructor(x, y, z, color, speed, direction, size, rotationSpeed) {
        super(x, y, z, color, speed, direction, size, rotationSpeed);

        // Check cube superclass for comments

        // front face left
        this.linePairs = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]];

    }
}