import {Camera3D} from "./engine/rendering/camera.js";
import {vec3} from "./engine/math/vec3.js";
import {Mesh} from "./engine/rendering/mesh.js";
import {Engine} from "./engine/engine.js";
import {shaderUtils} from "./engine/rendering/shaderUtils.js";

function main() {
    const engine = Engine.instance();
    engine.initialize(
        '#main-canvas',
        [600, 600],
        60, true, true,
        [0.85, 0.85, 0.85, 1]
    );

    advancedExample();
}

function advancedExample() {
    const engine = Engine.instance();

    const camera = new Camera3D(Math.PI / 3, 1, 1, 1000);
    camera.setPosition([0, 1.5, 3]);
    camera.setTarget([0, 0, 0]);

    const program = shaderUtils.createProgramFromScripts(
        engine.gl, ['vert-shader-3d', 'frag-shader-3d']
    );

    const model = new Mesh(engine.gl, program);
    model.setVertices(generateBasePlantVertices(6))
    model.setNormals();
    model.setColor([0.2, 0.85, 0.2, 1]);
    model.setReverseLightDirection(vec3.normalize([0.5, 0.7, 1]));
    model.setPosition([0, -0.5, 0]);
    model.setScale([0.3, 0.3, 0.3]);

    model.setSkeletonWeights([]);
    model.setCamera(camera);

    let angle = 0;
    model.update = (elapsed) => {
        angle += elapsed * 0.1 * Math.PI;
        if (angle > 2 * Math.PI) {
            angle -= 2 * Math.PI;
        }

        model.setSkeletonRotation(Math.sin(angle * 10) * Math.PI / 3);
    };

    engine.setRootScene(model);
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

function generateSkeletonWeights(points) {
    const levels = points.length / 4 / 3;
    const increment = 1 / levels;

    const weights = [];

    for (let i = 0; i < levels; i++) {
        for (let j = 0; j < 4; j++) {
            weights.push(i * increment);
        }
    }

    return weights;
}

function generateBasePlantVertices(height) {
    if (!height) {
        height = 4;
    }

    let baseShape = getBaseShape();
    const constructionVertices = [];
    for (const v of baseShape) {
        constructionVertices.push(v);
    }
    // return;

    for (let i = 1; i < height; i++) {
        const newBaseShape = [];
        for (const v of baseShape) {
            newBaseShape.push(v.map(a => a * 0.75));
        }
        baseShape = newBaseShape;

        for (const v of baseShape) {
            v[1] = i;
            constructionVertices.push(v);
        }
    }

    for (let i = 0; i < baseShape.length; i++) {
        constructionVertices.push([0, height, 0]);
    }

    const vertices = [];
    // only first ring for now
    for (let level = 0; level < height; level++) {
        for (let i = 0; i < 4; i++) {
            const next = i + 1 < baseShape.length ? i + 1 : 0;
            const rectVertices = [
                constructionVertices[baseShape.length * level + i],
                constructionVertices[baseShape.length * level + i + baseShape.length],
                constructionVertices[baseShape.length * level + next],
                constructionVertices[baseShape.length * level + next + baseShape.length]
            ]

            vertices.push(
                rectVertices[0],
                rectVertices[2],
                rectVertices[1],
                rectVertices[1],
                rectVertices[2],
                rectVertices[3],
            )
        }
    }

    const vertexData = [];
    for (const vertex of vertices) {
        for (const dataPoint of vertex) {
            vertexData.push(dataPoint);
        }
    }

    return vertexData;
}

function getBaseShape() {
    return [
        [-1, 0, 0],
        [0, 0, 0.7],
        [1, 0, 0],
        [0, 0, -0.5]
    ];
}

main();
