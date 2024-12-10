import { Cube } from './Cube.js';
import { Point } from './Point.js';

export const canvas = document.querySelector('canvas');
export const ctx = canvas.getContext('2d');
export let time = 0;

ctx.globalAlpha = 0.2;

let points = [];
let cubes = [];

let size = 0;
let count = 0;
let cubeCount = 10;

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

function createPoint(x, y, color, speed, dir, size) {
    return new Point(x, y, color, speed, dir, size);
}

function createCube(x, y, z, color, speed, dir, size, rotationSpeed) {
    let cube = new Cube(x, y, z, color, speed, dir, size, rotationSpeed);
    // generate each vertex
    let vertices = [
        { x: x, y: y, z: z },
        { x: x + size, y: y, z: z },
        { x: x, y: y + size, z: z },
        { x: x + size, y: y + size, z: z },

        //add depth offset to vertices
        { x: x, y: y, z: z + size },
        { x: x + size, y: y, z: z + size },
        { x: x, y: y + size, z: z + size },
        { x: x + size, y: y + size, z: z + size },
    ]
    cube.vertices = vertices;
    return cube;
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

    //loop over every cube
    cubes.forEach((p) => {
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

for (let i = 0; i < count; ++i) {
    let point = createPoint(Math.floor(Math.random() * canvas.width), Math.floor(Math.random() * canvas.height), '#4f4f5f', getSpeed(), getDirection(), size);
    points.push(point);

}
for (let i = 0; i < cubeCount; i++) {
    let cube = createCube(Math.floor(Math.random() * canvas.width), Math.floor(Math.random() * canvas.height), Math.floor(Math.random() * 1000), '#4f4f5f', 0, getDirection(), Math.random() * 200, getRotationSpeed());
    cubes.push(cube);
}

document.addEventListener('click', e => {
    // points.push(createPoint(e.pageX, e.pageY, '#4f4f5f', getSpeed(), getDirection()));
    let cube = createCube(e.pageX, e.pageY, 0, '#4f4f5f', 0, getDirection(), Math.random() * 200, getRotationSpeed());
    console.log(cube.vertices)
    cubes.push(cube);
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
