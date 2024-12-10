import { Cube } from "./Cube.js";

export class Prism extends Cube {
    constructor(x, y, z, color, speed, direction, size, rotationSpeed) {
        super(x, y, z, color, speed, direction, size, rotationSpeed);

        // Check cube superclass for comments

        this.linePairs = [[0, 1], [1, 2], [2, 0], [0, 3], [1, 3], [2, 3]];
    }
}