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
        this.wind = -3;

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

        let rigid = Engine.instance().world.getRigidBodyList().getNext();
        // setTimeout(() => {
        //     rigid.applyForceToCenter(new OIMO.Vec3(1 / 60, 0, 0));
        // }, 2000);
        //
        // setTimeout(() => {
        //     rigid.applyForceToCenter(new OIMO.Vec3(-30 / 60, 0, 0));
        // }, 4000);
    }

    update(elapsed) {
        super.update(elapsed);

        // wiggle animation and rotate!
        this.wind += elapsed * 0.2;
        document.title = 'Wind: ' + (-0.1).toFixed(2);

        if (this.skeleton) {
            // let rigid = Engine.instance().world.getRigidBodyList();
            // while (rigid) {
            //     rigid.applyForceToCenter(new OIMO.Vec3(0, 9.81 / 60, 0));
            //     rigid = rigid.getNext();
            // }
            let joint = Engine.instance().world.getJointList();
            const rigid1 = joint.getRigidBody1();
            const rigid2 = joint.getRigidBody2();

            // wind
            rigid2.applyForceToCenter(new OIMO.Vec3(-0.1 / 60, 0, 0));

            const upVector = new OIMO.Vec3(0, 1, 0);

            // normalized position (we are only interested in the angle)
            const basePosition = rigid1.getPosition().normalized();
            const tipPosition = rigid2.getPosition().normalized();

            let tipAngle = 0;
            const s1 = upVector.cross(tipPosition).length();
            const c1 = upVector.dot(tipPosition);
            if (s1 || c1) {
                tipAngle = Math.atan2(s1, c1);
            }

            // protect division by 0
            let baseAngle = 0;
            const s = upVector.cross(basePosition).length();
            const c = upVector.dot(basePosition);
            if (s || c) {
                baseAngle = Math.atan2(s, c);
            }

            // ranges from 0 to Math.PI
            const difference = Math.abs(tipAngle - baseAngle);
            let appliedForce = difference * 9.81;

            rigid2.applyForceToCenter(new OIMO.Vec3(0, appliedForce / 60, 0));

            // get angle orientation
            const angleDirection = Math.sign(upVector.cross(tipPosition).z);
            this.mesh.setSkeletonRotation(tipAngle * angleDirection);
        }
        // this.setRotation([0, this.angle, 0]);
    }

    calculateSkeletonBoneMatrix() {
    }

    render() {
        super.render();

        this.mesh.render(Engine.instance().camera);
    }

    setGenerationFunction(fn) {
        this.fn = fn;
    }
}
