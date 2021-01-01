import {SceneNode} from "../engine/scene-graph/scene-node.js";
import {Engine} from "../engine/engine.js";
import {Mesh} from "../engine/rendering/mesh.js";
import {shaderUtils} from "../engine/rendering/shaderUtils.js";
import {vec3} from "../engine/math/vec3.js";

export class BasePlant extends SceneNode {
    init() {
        super.init();
        const gl = Engine.instance().gl;

        this.program = shaderUtils.createProgramFromScripts(
            gl, ['vert-shader-3d', 'frag-shader-3d']
        );
        this.angle = 0;
        this.vertices = this.generateVertices(4);

        this.mesh = new Mesh(gl, this.program, this);
        this.mesh.setVertices(this.vertices);
        this.mesh.setNormals();
        this.mesh.setColor([0.2, 0.85, 0.2, 1]);
        this.mesh.setReverseLightDirection(vec3.normalize([0.5, 0.7, 1]));
        this.mesh.setSkeletonWeights(this.calculateSkeletonWeights());
    }

    update(elapsed) {
        super.update(elapsed);

        this.angle += elapsed * 0.1 * Math.PI;
        if (this.angle > 2 * Math.PI) {
            this.angle -= 2 * Math.PI;
        }

        this.mesh.setSkeletonRotation(Math.sin(this.angle * 10) * Math.PI / 3);
    }

    render() {
        super.render();

        this.mesh.render(Engine.instance().camera);
    }

    generateVertices(height) {
        if (!height) {
            height = 4;
        }

        let baseShape = this.getBaseShape();
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

    calculateSkeletonWeights() {
        const weights = [];
        let counter = 0;
        let baseWeight = 0;
        const weightStep = 1 / 6;
        let botTopCounter = 0;
        const order = [0, 0, 1, 1, 0, 1];
        for (let i = 0; i < this.vertices.length; i++) {
            if (order[botTopCounter] % 2 === 0) {
                weights.push(baseWeight);
            } else {
                weights.push(baseWeight + weightStep);
            }

            botTopCounter++;
            if (botTopCounter >= 6) {
                botTopCounter = 0;
            }
            counter++;
            if (counter === 24) {
                counter = 0;
                baseWeight += weightStep;
            }
        }

        return weights;
    }

    getBaseShape() {
        return [
            [-1, 0, 0],
            [0, 0, 0.7],
            [1, 0, 0],
            [0, 0, -0.5]
        ];
    }
}
