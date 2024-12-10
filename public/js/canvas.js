const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

ctx.globalAlpha = 0.2;

let points = [];
let polygons = [];

let size = 0;
let count = 0;

let z_speed = 0.05;
let x_speed = 0.15;
let y_speed = 0.1;

let time = 0;

let distanceToConnect = 256;

let speedMultiplier = .5;

let height = document.body.scrollHeight;
let width = document.body.scrollWidth;
canvas.style.background = "#191920"
canvas.style.height = `${width}px`;
canvas.style.height = `${height}px`;
canvas.width = width;
canvas.height = height;

class Point {
    constructor(x, y, color, speed, direction) {
        // constructor
        this.x = x;
        this.y = y;

        this.color = color;
        this.speed = speed;
        this.dir = direction;

        this.velocity = { x: 0, y: 0 };

        this.velocity.x = this.speed * Math.cos(this.dir);
        this.velocity.y = this.speed * Math.sin(this.dir);
    }

    // collisions
    checkCollisions() {
        if (this.x > (canvas.width - size)) {
            this.velocity.x *= -1;
        }
        if (this.x < (0)) {
            this.velocity.x *= -1;
        }
        if (this.y > (canvas.height - size)) {
            this.velocity.y *= -1;
        }
        if (this.y < (12 + size)) {
            this.velocity.y *= -1;
        }
    }

    // update position based on speed vector
    updatePos() {
        // this.velocity.x = this.speed * Math.cos(this.dir);
        // this.velocity.y = this.speed * Math.sin(this.dir);

        this.x += this.velocity.x;
        this.y += this.velocity.y;

    }
}
class Polygon {
    constructor(x, y, z, color, speed, direction, depth) {
        this.x = x;
        this.y = y;
        this.z = z;

        this.color = color;
        this.speed = speed;
        this.dir = direction;
        this.depth = depth;

        // initialize vertices array
        this.vertices = [];

        this.velocity = { x: 0, y: 0, z: 0 };

        this.velocity.x = this.speed * Math.cos(this.dir);
        this.velocity.y = this.speed * Math.sin(this.dir);
    }

    // check collisions
    checkCollisions() {
        if (this.x > (canvas.width - size - this.depth)) {
            this.velocity.x *= -1;
        }
        if (this.x < (0)) {
            this.velocity.x *= -1;
        }
        if (this.y > (canvas.height - size - this.depth)) {
            this.velocity.y *= -1;
        }
        if (this.y < (12 + size)) {
            this.velocity.y *= -1;
        }
    }

    // update position based on speed vector
    updatePos() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        let angle = time * z_speed * Math.PI * 2;
        this.vertices.forEach(v => {
            let dx = v.x - this.x;
            let dy = v.y - this.y;

            let x = dx * Math.cos(angle) - dy * Math.sin(angle);
            let y = dx * Math.sin(angle) + dy * Math.cos(angle);

            v.x = x + this.x;
            v.y = y + this.y;
        });

        angle = time * x_speed * Math.PI * 2;
        this.vertices.forEach(v => {
            let dy = v.y - this.y;
            let dz = v.z - this.z;

            let y = dy * Math.cos(angle) - dz * Math.sin(angle);
            let z = dy * Math.sin(angle) + dz * Math.cos(angle);

            v.y = y + this.y;
            v.z = z + this.z;
        });

        angle = time * y_speed * Math.PI * 2;
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

function getDistance(p1, p2) {
    let distance = Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
    if (isNaN(distance)) return;
    return distance;
}

function createPoint(x, y, color, speed, dir) {
    return new Point(x, y, color, speed, dir);
}

function createPolygon(x, y, z, color, speed, dir, size, depth, rotation) {
    let polygon = new Polygon(x, y, z, color, speed, dir, depth, rotation);
    // generate each vertex
    let vertices = [
        { x: x, y: y, z: z },
        { x: x + size, y: y, z: z },
        { x: x, y: y + size, z: z },
        { x: x + size, y: y + size, z: z },

        //add depth offset to vertices
        { x: x - depth, y: y - depth, z: z },
        { x: x + size - depth, y: y - depth, z: z },
        { x: x - depth, y: y + size - depth, z: z },
        { x: x + size - depth, y: y + size - depth, z: z },
    ]
    polygon.vertices = vertices;
    return polygon;
}

function createLine(startPoint, endPoint, color) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.moveTo(startPoint.x + size / 2, startPoint.y + size / 2)
    ctx.lineTo(endPoint.x + size / 2, endPoint.y + size / 2)
    ctx.stroke();
    ctx.closePath();
}

function getSpeed() {
    let speed = Math.ceil(Math.random() * speedMultiplier);
    return speed;
}
function getDirection() {
    return Math.random() * Math.PI * 2
}
function getColor(alpha) {
    return `rgba(100, 100, 120, ${(300 - alpha) / 255})`;
}
function update() {
    //clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //loop over every point
    points.forEach((p) => {
        // collisions then update positions
        p.updatePos();
        p.checkCollisions();

        //draw lines between points
        // createLine(points[i], { x: width / 2, y: 2000 }, '#3f3f4f');

        //draw all points
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, size, size);

        // draw lines between points that are close by
        points.forEach(p2 => {
            let distance = getDistance(p, p2);

            if (distance < distanceToConnect) {
                createLine(p, p2, getColor(distance));
            }
        })
    });

    //loop over every polygon
    polygons.forEach((p) => {
        p.updatePos();
        p.checkCollisions();

        // create lines between all vertices
        createLine(p.vertices[0], p.vertices[1], p.color);
        createLine(p.vertices[1], p.vertices[3], p.color);
        createLine(p.vertices[3], p.vertices[2], p.color);
        createLine(p.vertices[2], p.vertices[0], p.color);

        createLine(p.vertices[4], p.vertices[5], p.color);
        createLine(p.vertices[5], p.vertices[7], p.color);
        createLine(p.vertices[7], p.vertices[6], p.color);
        createLine(p.vertices[6], p.vertices[4], p.color);

        createLine(p.vertices[0], p.vertices[4], p.color);
        createLine(p.vertices[1], p.vertices[5], p.color);
        createLine(p.vertices[2], p.vertices[6], p.color);
        createLine(p.vertices[3], p.vertices[7], p.color);


    })
}

for (i = 0; i < count; ++i) {
    let point = createPoint(Math.floor(Math.random() * canvas.width), Math.floor(Math.random() * canvas.height), '#4f4f5f', getSpeed(), getDirection());
    points.push(point);

}

document.addEventListener('click', e => {
    // points.push(createPoint(e.pageX, e.pageY, '#4f4f5f', getSpeed(), getDirection()));
    let polygon = createPolygon(e.pageX, e.pageY, 0, '#4f4f5f', 0, getDirection(), 200, 50);
    console.log(polygon.vertices)
    polygons.push(polygon);
})

setInterval(() => {
    height = document.body.scrollHeight;
    width = document.body.scrollWidth;
    canvas.style.background = "#191920"
    canvas.style.height = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.width = width;
    canvas.height = height;

    time = 0.01;

    update();
}, 1000 / 60);
