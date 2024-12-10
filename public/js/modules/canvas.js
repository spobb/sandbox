import { Cube } from './Cube.js';
import { Point } from './Point.js';
import { Prism } from './Prism.js';

export const canvas = document.querySelector('canvas');
export const ctx = canvas.getContext('2d');
export let time = 0;

ctx.globalAlpha = 0.2;

let points = [];
let cubes = [];
let prisms = [];

let size = 4;
let count = 100;
let cubeCount = 10;
let prismCount = 20;

let distanceToConnect = 256;

let speedMultiplier = .5;
let rotationSpeedMultiplier = .1;

let height = document.body.scrollHeight;
let width = document.body.scrollWidth;
canvas.style.background = "#191920"
canvas.style.height = `${width}px`;
canvas.style.height = `${height}px`;
canvas.width = width;
canvas.height = height;

function getDistance(p1, p2) {
    let distance = Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
    if (isNaN(distance)) return;
    return distance;
}

function createPoint(coords, color, speed, dir, size) {
    let x = coords.x;
    let y = coords.y;
    return new Point(x, y, color, speed, dir, size);
}

function createCube(coords, color, speed, dir, size, rotationSpeed) {
    let x = coords.x;
    let y = coords.y;
    let z = coords.z;

    // instantiate Cube object
    let cube = new Cube(x, y, z, color, speed, dir, size, rotationSpeed);

    // generate each vertex
    let vertices = [

        // front face
        { x: x, y: y, z: z },
        { x: x + size, y: y, z: z },
        { x: x, y: y + size, z: z },
        { x: x + size, y: y + size, z: z },

        //add depth offset to vertices (back face)
        { x: x, y: y, z: z + size },
        { x: x + size, y: y, z: z + size },
        { x: x, y: y + size, z: z + size },
        { x: x + size, y: y + size, z: z + size },
    ]

    // add generated vertices to object and return object
    cube.vertices = vertices;
    return cube;
}

function createPrism(coords, color, speed, dir, size, rotationSpeed) {
    let x = coords.x;
    let y = coords.y;
    let z = coords.z;

    // instantiate prism object
    let prism = new Prism(x, y, z, color, speed, dir, size, rotationSpeed);

    // generate each vertex
    let vertices = [

        // triangle base
        { x: x, y: y, z: z },
        { x: x + size / 2, y: y + Math.sqrt((size ** 2) - (size ** 2) / 4), z: z },
        { x: x + size, y: y, z: z },

        // top point (height along z axis)
        { x: x + size / 2, y: y + size / 2, z: z + size * Math.random() * 2 },
    ]

    // add generated vertices to object and return object
    prism.vertices = vertices;
    return prism;
}

function createLine(startPoint, endPoint, color) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;

    // create line between centers of two points
    ctx.moveTo(startPoint.x + size / 2, startPoint.y + size / 2)
    ctx.lineTo(endPoint.x + size / 2, endPoint.y + size / 2)
    ctx.stroke();
    ctx.closePath();
}

function getSpeed() {
    let speed = Math.ceil(Math.random() * speedMultiplier);
    return speed;
}
function getSign() {
    return Math.random() > 0.5 ? -1 : 1;
}
function getRotationSpeed() {
    return {
        x: Math.random() * rotationSpeedMultiplier * getSign(),
        y: Math.random() * rotationSpeedMultiplier * getSign(),
        z: Math.random() * rotationSpeedMultiplier * getSign()
    }

}
function getCoords() {
    return {
        x: Math.floor(Math.random() * canvas.width),
        y: Math.floor(Math.random() * canvas.height),
        z: Math.floor(Math.random()) * 1000,
    }
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

    //loop over every cube
    cubes.forEach((c) => {
        c.updatePos();
        c.checkCollisions();

        // create lines between all pairs of vertices (edges)
        c.linePairs.forEach(pair => {
            createLine(c.vertices[pair[0]], c.vertices[pair[1]], c.color);
        })
    })

    // loop over each prism
    prisms.forEach((p) => {
        p.updatePos();
        p.checkCollisions();

        // create lines between all pairs of vertices (edges)
        p.linePairs.forEach(pair => {
            createLine(p.vertices[pair[0]], p.vertices[pair[1]], p.color);
        })
    })
}

for (let i = 0; i < count; ++i) {
    let point = createPoint(getCoords(), '#4f4f5f', getSpeed(), getDirection(), size);
    points.push(point);
}
for (let i = 0; i < cubeCount; i++) {
    let cube = createCube(getCoords(), '#4f4f5f', 1, getDirection(), Math.random() * 200, getRotationSpeed());
    cubes.push(cube);
}
for (let i = 0; i < prismCount; i++) {
    let prism = createPrism(getCoords(), '#4f4f5f', 0, getDirection(), Math.random() * 200, getRotationSpeed());
    prisms.push(prism);
}

// Add a cube at cursor position on click

document.addEventListener('click', e => {
    let cube = createCube({ x: e.pageX, y: e.pageY, z: 100 }, '#4f4f5f', 1, getDirection(), Math.random() * 200, getRotationSpeed());
    cubes.push(cube);
})

// Resize canvas if window resized and draw loop

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
