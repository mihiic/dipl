import {SceneNode} from "../engine/scene-graph/scene-node.js";
import {Engine} from "../engine/engine.js";
import {Mesh} from "../engine/rendering/mesh.js";
import {shaderUtils} from "../engine/rendering/shaderUtils.js";
import {vec3} from "../engine/math/vec3.js";
import {PlantGenerator} from "./generation/plant-generator.js";
import {PlantSkeleton} from "./plant-skeleton.js";

export class Plant extends SceneNode {
    init() {
        super.init();
        const gl = Engine.instance().gl;

        this.program = shaderUtils.createProgramFromScripts(
            gl, ['vert-shader-3d', 'frag-shader-3d']
        );
        this.angle = 0;

        const plantGenerator = new PlantGenerator(this.fn)
        if (!this.lod) {
            this.lod = 4;
        }

        if (!this.height) {
            this.height = this.fn.generateHeight();
        }

        this.vertices = plantGenerator.getVertices(this.height, this.lod);

        // mesh properties
        this.mesh = new Mesh(gl, this.program, this);
        this.mesh.setVertices(this.vertices);
        this.mesh.setNormals();
        this.mesh.setColor([0.2, 0.85, 0.2, 1]);
        this.mesh.setReverseLightDirection(vec3.normalize([0.5, 0.7, 1]));
        this.mesh.setSkeletonWeights(plantGenerator.calculateSkeletonWeights());

        this.skeleton = null;
    }

    setLod(lod) {
        this.lod = lod;
    }

    setHeight(height) {
        this.height = height;
    }

    enablePhysics() {
        this.skeleton = new PlantSkeleton();
        this.skeleton.skeletonSetup();
    }

    update(elapsed) {
        super.update(elapsed);

        // wiggle animation and rotate!
        this.angle += elapsed * 0.1 * Math.PI;
        if (this.angle > 2 * Math.PI) {
            this.angle -= 2 * Math.PI;
        }

        this.mesh.setSkeletonRotation(Math.sin(this.angle * 10) * Math.PI / 12);

        // if (this.skeleton) {
        //     let rigid = Engine.instance().world.getRigidBodyList();
        //     console.log(rigid.getPosition());
        //
        //     rigid = rigid.getNext();
        //     while (rigid) {
        //         console.log(rigid.getPosition());
        //         rigid = rigid.getNext();
        //     }
        // }
        // this.setRotation([0, this.angle, 0]);
    }

    render() {
        super.render();

        this.mesh.render(Engine.instance().camera);
    }

    setGenerationFunction(fn) {
        this.fn = fn;
    }
}
