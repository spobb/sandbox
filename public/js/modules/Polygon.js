import { Cube } from "./Cube.js";

export class Polygon extends Cube {
    constructor(x, y, z, color, speed, direction, size, rotationSpeed) {
        super(x, y, z, color, speed, direction, size, rotationSpeed);

        // Check cube superclass for comments

        // front face left
        this.linePairs = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0],
        // front face right
        [0, 8], [8, 9], [9, 10], [10, 11], [11, 12], [12, 13], [13, 14], [14, 0],
        // front face middle
        [7, 15], [15, 16], [16, 17], [17, 18], [18, 14],

        // back face left
        [19, 20], [20, 21], [21, 22], [22, 23], [23, 24], [24, 25], [25, 26], [26, 19],
        // back face right
        [19, 27], [27, 28], [28, 29], [29, 30], [30, 31], [31, 32], [32, 33], [33, 19],
        // back face middle
        [26, 34], [34, 35], [35, 36], [36, 37], [37, 33],
        // connect faces
        [0, 19], [1, 20], [2, 21], [3, 22], [4, 23], [5, 24], [6, 25], [7, 26], [8, 27], [9, 28], [10, 29],
        [11, 30], [12, 31], [13, 32], [14, 33], [15, 34], [16, 35], [17, 36], [18, 37],
        ];
    }
}