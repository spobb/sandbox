import { canvas } from './canvas.js'

export class Point {
    constructor(x, y, color, speed, direction, size) {
        // constructor
        this.x = x;
        this.y = y;

        this.color = color;
        this.speed = speed;
        this.dir = direction;
        this.size = size;

        this.velocity = { x: 0, y: 0 };

        this.velocity.x = this.speed * Math.cos(this.dir);
        this.velocity.y = this.speed * Math.sin(this.dir);
    }

    // collisions
    checkCollisions() {
        if (this.x > (canvas.width - this.size)) {
            this.velocity.x *= -1;
        }
        if (this.x < (0)) {
            this.velocity.x *= -1;
        }
        if (this.y > (canvas.height - this.size)) {
            this.velocity.y *= -1;
        }
        if (this.y < (12 + this.size)) {
            this.velocity.y *= -1;
        }
    }

    // update position based on speed vector
    updatePos() {

        this.x += this.velocity.x;
        this.y += this.velocity.y;

    }
}