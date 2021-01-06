import {Engine} from "../engine/engine.js";

export class PlantSkeleton {
    constructor() {
        this.world = Engine.instance().world;
        this.rigidBodies = [];
        this.joints = [];
    }

    skeletonSetup(plant) {
        const origin = new OIMO.Vec3(plant.position[0], plant.position[1], plant.position[2]);
        // base
        const baseConfig = new OIMO.RigidBodyConfig();
        baseConfig.position = origin;
        baseConfig.type = OIMO.RigidBodyType.STATIC;

        let shapeConfig = new OIMO.ShapeConfig();
        shapeConfig.geometry = new OIMO.BoxGeometry(new OIMO.Vec3(0.1, 0.1, 0.1));

        const base = new OIMO.RigidBody(baseConfig);
        base.addShape(new OIMO.Shape(shapeConfig));
        this.world.addRigidBody(base);

        // tip
        const tipConfig = new OIMO.RigidBodyConfig();
        tipConfig.position = origin.add(new OIMO.Vec3(0, plant.height, 0));
        tipConfig.type = OIMO.RigidBodyType.DYNAMIC;

        shapeConfig = new OIMO.ShapeConfig();
        shapeConfig.geometry = new OIMO.BoxGeometry(new OIMO.Vec3(0.1, 0.1, 0.1));

        const tip = new OIMO.RigidBody(tipConfig);
        tip.addShape(new OIMO.Shape(shapeConfig));

        this.world.addRigidBody(tip);

        // joint
        const jointConfig = new OIMO.SphericalJointConfig();
        jointConfig.init(base, tip, baseConfig.position);
        jointConfig.springDamper = new OIMO.SpringDamper().setSpring(0, 0);
        jointConfig.breakForce = 0;
        jointConfig.breakTorque = 0;

        const joint = new OIMO.SphericalJoint(jointConfig);
        this.world.addJoint(joint);

        this.joints.push(joint);
    }
}
