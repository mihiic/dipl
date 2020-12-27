import {mat4} from "./mat4.js";
import {mat3} from "./mat3.js";
import {Camera3D} from "./camera.js";
import {vec3} from "./vec3.js";
import {Mesh} from "./mesh.js";

function main() {
    const canvas = document.querySelector('#main-canvas');
    const gl = canvas.getContext('webgl');

    if (!gl) {
        console.error('Could not load webgl context');
        return;
    }

    // set canvas and background
    // webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, 600, 600);
    gl.clearColor(0.95, 0.95, 0.95, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    // basicExample(gl);
    advancedExample(gl);
}

function advancedExample(gl) {
    const camera = new Camera3D(Math.PI / 3, 1, 1, 1000);
    camera.setPosition([0, 1.5, 3]);
    camera.setTarget([0, 0, 0]);

    const program = webglUtils.createProgramFromScripts(gl, ['vert-shader-3d', 'frag-shader-3d']);
    gl.useProgram(program);

    const model = new Mesh(gl, program);
    model.setVertices(generateCubeVertices())
    model.setNormals();
    model.setColor([0.2, 0.85, 0.2, 1]);
    model.setReverseLightDirection(vec3.normalize([0.5, 0.7, 1]));

    let angle = 0;
    setInterval(() => {
        gl.clearColor(0.95, 0.95, 0.95, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        angle += 2 * Math.PI / 1000;
        if (angle > 2 * Math.PI) {
            angle -= 2 * Math.PI;
        }

        model.setRotation([0, angle, 0]);
        model.render(camera);
    }, 16);
}

function generateCubeVertices() {
    const vertices = [
        [-0.5, -0.5, 0.5],
        [-0.5, 0.5, 0.5],
        [0.5, 0.5, 0.5],
        [0.5, -0.5, 0.5],
        [-0.5, -0.5, -0.5],
        [-0.5, 0.5, -0.5],
        [0.5, 0.5, -0.5],
        [0.5, -0.5, -0.5]
    ];

    const points = [
        vertices[0], vertices[2], vertices[1], vertices[0], vertices[3], vertices[2],
        vertices[4], vertices[3], vertices[0], vertices[4], vertices[7], vertices[3],
        vertices[5], vertices[7], vertices[4], vertices[5], vertices[6], vertices[7],
        vertices[1], vertices[6], vertices[5], vertices[1], vertices[2], vertices[6],
        vertices[3], vertices[6], vertices[2], vertices[3], vertices[7], vertices[6],
        vertices[1], vertices[4], vertices[0], vertices[1], vertices[5], vertices[4]

    ];

    const vertexData = [];
    for (const vertex of points) {
        for (const dataPoint of vertex) {
            vertexData.push(dataPoint);
        }
    }

    return vertexData;
}

function generateRectanglePoints(x, y, w, h) {
    const x1 = x;
    const y1 = y;
    const x2 = x + w;
    const y2 = y + h;

    return [
        x1, y1,
        x2, y1,
        x1, y2,
        x1, y2,
        x2, y1,
        x2, y2
    ];
}

main();
