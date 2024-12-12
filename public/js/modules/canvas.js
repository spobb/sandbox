import { Cube } from './Cube.js';
import { Point } from './Point.js';
import { Prism } from './Prism.js';
import { Polygon } from './Polygon.js';

export const canvas = document.querySelector('canvas');
export const ctx = canvas.getContext('2d');
export let time = 0;

function clamp(number, min, max) {
    return Math.max(Math.min(max, number), min);
}

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
        { x: x - size, y: y - size, z: z - size },
        { x: x + size, y: y - size, z: z - size },
        { x: x + size, y: y + size, z: z - size },
        { x: x - size, y: y + size, z: z - size },
        { x: x - size, y: y - size, z: z + size },
        { x: x + size, y: y - size, z: z + size },
        { x: x + size, y: y + size, z: z + size },
        { x: x - size, y: y + size, z: z + size },
    ]

    let faces = [
        [vertices[0], vertices[1], vertices[2], vertices[3]],
        [vertices[0], vertices[4], vertices[5], vertices[1]],
        [vertices[1], vertices[5], vertices[6], vertices[2]],
        [vertices[3], vertices[2], vertices[6], vertices[7]],
        [vertices[0], vertices[3], vertices[7], vertices[4]],
        [vertices[4], vertices[5], vertices[6], vertices[7]],
    ];

    // add generated vertices to object and return object
    cube.vertices = vertices;
    cube.faces = faces;
    return cube;
}

function createPolygon(coords, color, speed, dir, size, rotationSpeed) {
    let x = coords.x;
    let y = coords.y;
    let z = coords.z;

    let half = size * 0.5;
    let quarter = size * 0.25;

    let depth = size * 0.5;


    // instantiate Cube object
    let polygon = new Polygon(x, y, z, color, speed, dir, size, rotationSpeed);

    // generate each vertex
    let vertices = [
        { x: x - size * Math.random(), y: y - size * Math.random(), z: z - size * Math.random() },
        { x: x + size * Math.random(), y: y - size * Math.random(), z: z - size },
        { x: x + size * Math.random(), y: y + size * Math.random(), z: z - size },
        { x: x - size * Math.random(), y: y + size, z: z - size },
        { x: x - size * Math.random(), y: y - size, z: z + size * Math.random() },
        { x: x + size * Math.random(), y: y - size, z: z + size },
        { x: x + size * Math.random(), y: y + size * Math.random(), z: z + size },
        { x: x - size * Math.random(), y: y + size, z: z + size },
    ]

    let faces = [
        [vertices[0], vertices[1], vertices[2], vertices[3]],
        [vertices[0], vertices[4], vertices[5], vertices[1]],
        [vertices[1], vertices[5], vertices[6], vertices[2]],
        [vertices[3], vertices[2], vertices[6], vertices[7]],
        [vertices[0], vertices[3], vertices[7], vertices[4]],
        [vertices[4], vertices[5], vertices[6], vertices[7]],
    ];

    // add generated vertices to object and return object
    polygon.vertices = vertices;
    polygon.faces = faces;
    return polygon;
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
        { x: x + size / 2, y: y + size / 2, z: clamp(z + size * Math.random() * 2, size, size * 2) },
    ]

    let faces = [
        [vertices[0], vertices[1], vertices[2]],
        [vertices[0], vertices[1], vertices[3]],
        [vertices[1], vertices[2], vertices[3]],
        [vertices[2], vertices[0], vertices[3]],
    ];

    // add generated vertices to object and return object
    prism.vertices = vertices;
    prism.faces = faces;
    return prism;
}
function project(vertices, width, height) {
    let points2d = new Array(vertices.length);
    vertices.forEach((v, i) => {
        let x = v.x * (FOCAL_LENGTH / v.z) + width * 0.5;
        let y = v.y * (FOCAL_LENGTH / v.z) + height * 0.5;
        console.log(x, y, v.x, v.y, vertices[0], vertices[1])
        points2d[i] = { x: x, y: y };
    })
    return points2d;
}
function createLine(startPoint, endPoint, color) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 2;

    // create line between centers of two points
    ctx.moveTo(startPoint.x, startPoint.y)
    ctx.lineTo(endPoint.x, endPoint.y)
    ctx.stroke();
    ctx.closePath();
}

function createFace(face, color) {
    ctx.beginPath();
    ctx.moveTo(face[0].x, face[0].y)
    for (let i = 1; i < face.length; i++) {
        ctx.lineTo(face[i].x, face[i].y)
    }
    ctx.fillStyle = color;
    ctx.fill();
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
        z: Math.floor(Math.random()) * -100,
    }
}
function getDirection() {
    return Math.random() * Math.PI * 2
}
function getColor(alpha) {
    return `rgba(100, 100, 120, ${(300 - alpha) / 255})`;
}

const DRAW_CENTER = false;
const RENDER_FACES = true;
const COLORED_CUBES = false;

let points = [];
let cubes = [];
let prisms = [];
let polygons = [];
let colors = ['#cccccc', '#aaaaaa', '#aaaaaa', '#999999', '#999999', '#444444',]

export let size = 0;
export let count = 200;
export let cubeCount = 20;
export let polygonCount = 20;
export let prismCount = 20;

let distanceToConnect = 256;

export let speedMultiplier = .5;
export let rotationSpeedMultiplier = .1;

ctx.globalAlpha = 1;
let height = document.body.scrollHeight;
let width = document.body.scrollWidth;
canvas.style.background = "#191920"
canvas.style.height = `${width}px`;
canvas.style.height = `${height}px`;
canvas.width = width;
canvas.height = height;

function update() {
    //clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //loop over every point
    points.forEach((p) => {
        // collisions then update positions
        p.checkCollisions();
        p.updatePos();

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
        c.checkCollisions();
        c.updatePos();


        // let vertices = project(c.vertices, canvas.width, canvas.height);
        if (RENDER_FACES) {
            for (let i = c.faces.length - 1; i > -1; --i) {
                let f = c.faces[i];

                // get normals
                let p1 = f[0];
                let p2 = f[1];
                let p3 = f[2];

                let u = { x: p2.x - p1.x, y: p2.y - p1.y, z: p2.z - p1.z };
                let v = { x: p3.x - p1.x, y: p3.y - p1.y, z: p3.z - p1.z };

                let normal = {
                    x: u.y * v.z - u.z * v.y,
                    y: u.z * v.x - u.x * v.z,
                    z: u.x * v.y - u.y * v.x
                };
                // if (-(p1.x) * normal.x + -(p1.y) * normal.y + -(p1.z) * normal.z <= 0) {
                if (COLORED_CUBES) {
                    createFace(f, `hsl(${((((c.x + c.y) / (canvas.width + canvas.height)) * 255) + time)}, ${70 - (i * 2)}%, 70%)`);
                } else {
                    createFace(f, colors[i]);
                }
                // }
            }
        }
        //draw centers
        if (DRAW_CENTER) {
            ctx.fillStyle = 'red';
            ctx.fillRect(c.x, c.y, 10, 10);
        }
        // create lines between all pairs of vertices(edges)
        c.linePairs.forEach(pair => {
            createLine(c.vertices[pair[0]], c.vertices[pair[1]], c.color);
        })
    })

    polygons.forEach((p) => {
        p.checkCollisions();
        p.updatePos();

        if (RENDER_FACES) {
            for (let i = p.faces.length - 1; i > -1; --i) {
                let f = p.faces[i];
                createFace(f, colors[i]);
            }
        }

        // create lines between all pairs of vertices (edges)
        p.linePairs.forEach(pair => {
            createLine(p.vertices[pair[0]], p.vertices[pair[1]], p.color);
        })
    })

    // loop over each prism
    prisms.forEach((p) => {
        p.checkCollisions();
        p.updatePos();

        if (RENDER_FACES) {
            for (let i = p.faces.length - 1; i > -1; --i) {
                let f = p.faces[i];
                createFace(f, colors[i]);
            }
        }

        // create lines between all pairs of vertices (edges)
        p.linePairs.forEach(pair => {
            createLine(p.vertices[pair[0]], p.vertices[pair[1]], p.color);
        })
    })
}

// Initialize objects
for (let i = 0; i < count; ++i) {
    let point = createPoint(getCoords(), '#4f4f5f', getSpeed(), getDirection(), size);
    points.push(point);
}
for (let i = 0; i < cubeCount; i++) {
    let cube = createCube(getCoords(), '#4f4f5f', .5, getDirection(), clamp(Math.random() * 80, 20, 80), getRotationSpeed());
    cubes.push(cube);
}
for (let i = 0; i < polygonCount; i++) {
    let polygon = createPolygon(getCoords(), '#4f4f5f', .2, getDirection(), clamp(Math.random() * 80, 20, 80), getRotationSpeed());
    polygons.push(polygon);
}
for (let i = 0; i < prismCount; i++) {
    let prism = createPrism(getCoords(), '#4f4f5f', .5, getDirection(), clamp(Math.random() * 100, 30, 100), getRotationSpeed());
    prisms.push(prism);
}

// Add a cube at cursor position on click

document.addEventListener('click', e => {
    cubes.push(createCube({ x: e.pageX, y: e.pageY, z: 100 }, '#4f4f5f', .5, getDirection(), clamp(Math.random() * 50, 10, 50), getRotationSpeed()));

    // polygons.push(createPolygon({ x: e.pageX, y: e.pageY, z: 100 }, '#4f4f5f', 1, getDirection(), Math.random() * 200, getRotationSpeed()));
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
