import { canvas, time } from './canvas.js'

export class Cube {
    constructor(x, y, z, color, speed, direction, size, rotationSpeed) {
        this.x = x;
        this.y = y;
        this.z = z;

        this.color = color;
        this.speed = speed;
        this.rotationSpeed = rotationSpeed;
        this.dir = direction;
        this.size = size;

        // initialize vertices array
        this.vertices = [];
        this.faces = [];

        // initialize velocity vector
        this.velocity = { x: 0, y: 0, z: 0 };

        // calculate velocity from speed and direction
        this.velocity.x = this.speed * Math.cos(this.dir);
        this.velocity.y = this.speed * Math.sin(this.dir);
        this.velocity.z = this.speed * Math.cos(this.dir);

        // matrix of pairs of vertices, each representing an edge to draw
        this.linePairs = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]];
    }

    // check collisions with walls
    checkCollisions() {
        if (this.x > (canvas.width - this.size - this.depth)) {
            this.velocity.x *= -1;
        }
        if (this.x < (0)) {
            this.velocity.x *= -1;
        }
        if (this.y > (canvas.height - this.size - this.depth)) {
            this.velocity.y *= -1;
        }
        if (this.y < (12 + this.size)) {
            this.velocity.y *= -1;
        }
    }

    updatePos() {
        // update position of object based on current velocity
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.z += this.velocity.z;

        // update position of each vertex based on rotation

        // rotate Z axis
        let angle = time * this.rotationSpeed.z * Math.PI * 2;
        this.vertices.forEach(v => {
            let dx = v.x - this.x;
            let dy = v.y - this.y;

            let x = dx * Math.cos(angle) - dy * Math.sin(angle);
            let y = dx * Math.sin(angle) + dy * Math.cos(angle);

            v.x = x + this.x;
            v.y = y + this.y;
        });

        // rotate X axis
        angle = time * this.rotationSpeed.x * Math.PI * 2;
        this.vertices.forEach(v => {
            let dy = v.y - this.y;
            let dz = v.z - this.z;

            let y = dy * Math.cos(angle) - dz * Math.sin(angle);
            let z = dy * Math.sin(angle) + dz * Math.cos(angle);

            v.y = y + this.y;
            v.z = z + this.z;
        });

        // rotate Y axis
        angle = time * this.rotationSpeed.y * Math.PI * 2;
        this.vertices.forEach(v => {
            let dx = v.x - this.x;
            let dz = v.z - this.z;

            let x = dz * Math.sin(angle) + dx * Math.cos(angle);
            let z = dz * Math.cos(angle) - dx * Math.sin(angle);

            v.x = x + this.x;
            v.z = z + this.z;
        });

    }
}