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
        this.windStrength = 0;
        this.windAngle = 0;
    }

    setWind(angle, strength) {
        this.windAngle = angle / 57.3;
        this.windStrength = strength;
    }

    setLod(lod) {
        this.lod = lod;
    }

    setHeight(height) {
        this.height = height;
    }

    enablePhysics() {
        this.skeleton = new PlantSkeleton();
        this.skeleton.skeletonSetup(this);
    }

    update(elapsed) {
        super.update(elapsed);

        if (this.skeleton) {
            const angles = this.simulateMovement();
            this.mesh.setSkeletonRotation(angles);
        }
    }

    simulateMovement() {
        let rot = null;
        for (const joint of this.skeleton.joints) {
            const rigid1 = joint.getRigidBody1();
            const rigid2 = joint.getRigidBody2();

            this.applyWind(rigid2);
            this.applyInnerFriction(rigid2);

            // we need relative position of joint
            const pos1 = rigid1.getPosition();
            const pos2 = pos1.sub(rigid2.getPosition());

            rot = [this.calculateAngleX(pos2), 0, this.calculateAngleZ(pos2)];

            const force = Math.abs(this.forceFactor(pos2));
            rigid2.applyForceToCenter(new OIMO.Vec3(0, force / 2, 0));
        }

        return rot;
    }

    calculateAngleZ(pos) {
        return Math.atan2(pos.y, pos.z) + Math.PI / 2;
    }

    calculateAngleX(pos) {
        return Math.atan2(pos.y, pos.x) + Math.PI / 2;
    }

    applyWind(rigid) {
        if (this.windStrength < 0.1) {
            return;
        }
        rigid.applyForceToCenter(new OIMO.Vec3(
            Math.cos(this.windAngle) / 60 * this.windStrength,
            0,
            Math.sin(this.windAngle) / 60 * this.windStrength)
        );
    }

    forceFactor(pos) {
        if (Math.abs(pos.x) < 0.01 && Math.abs(pos.z) < 0.01) {
            return 0;
        }

        pos.y = -pos.y;
        const a = Math.sqrt(pos.x * pos.x + pos.z * pos.z);
        const h = Math.sqrt(a * a + pos.y * pos.y)
        return Math.asin(
            a / h
        );
    }

    applyInnerFriction(rigid) {
        const vel = rigid.getLinearVelocity();
        rigid.setLinearVelocity(new OIMO.Vec3(vel.x * 0.99, vel.y * 0.99, vel.z * 0.99));
    }

    render() {
        super.render();

        this.mesh.render(Engine.instance().camera);
    }

    setGenerationFunction(fn) {
        this.fn = fn;
    }

    vecToString(vec) {
        return `x: ${vec.x.toFixed(2)} y: ${vec.y.toFixed(2)} z: ${vec.z.toFixed(2)}`;
    }
}
