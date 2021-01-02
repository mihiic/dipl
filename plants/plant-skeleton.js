import {Engine} from "../engine/engine.js";

export class PlantSkeleton {
    constructor() {
        this.world = Engine.instance().world;
        this.rigidBodies = [];
    }

    skeletonSetup() {
        // base
        const baseConfig = new OIMO.RigidBodyConfig();
        baseConfig.type = OIMO.RigidBodyType.STATIC;

        let shapeConfig = new OIMO.ShapeConfig();
        shapeConfig.geometry = new OIMO.BoxGeometry(new OIMO.Vec3(0.1, 0.1, 0.1));

        const base = new OIMO.RigidBody(baseConfig);
        base.addShape(new OIMO.Shape(shapeConfig));
        this.world.addRigidBody(base);

        // tip
        const tipConfig = new OIMO.RigidBodyConfig();
        tipConfig.position = new OIMO.Vec3(0, 5, 0);
        tipConfig.type = OIMO.RigidBodyType.DYNAMIC;

        shapeConfig = new OIMO.ShapeConfig();
        shapeConfig.geometry = new OIMO.BoxGeometry(new OIMO.Vec3(0.1, 0.1, 0.1));

        const tip = new OIMO.RigidBody(tipConfig);
        tip.addShape(new OIMO.Shape(shapeConfig));

        this.world.addRigidBody(tip);
    }
}
