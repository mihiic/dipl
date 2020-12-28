import {mat4} from "../math/mat4.js";
import {Engine} from "../engine.js";

export class TransformNode {
    constructor(parent, position, rotation, scale) {
        if (parent) {
            this.assignParent(parent);
        }
        this.id = Engine.instance().generateId();
        this.children = [];
        this.init(position, rotation, scale);
    }

    assignParent(parent) {
        if (this.parent) {
            this.removeChild(this);
        }

        this.parent = parent;
        parent.addChild(child);
    }

    removeChild(child) {
        this.children = this.children.filter(c => c.id !== child.id);
        if (child.parent.id === this.id) {
            child.parent = null;
        }
    }

    addChild(child) {
        for (const c of this.children) {
            if (c.id === child.id) {
                return;
            }
        }

        if (child.parent && child.parent.id !== this.id) {
            child.parent.removeChild(child);
        }

        child.parent = this;
        this.children.push(child);
    }

    setPosition(pos) {
        this.position = pos;
        this.recalculate();
    }

    setRotation(rotation) {
        this.rotation = rotation;
        this.recalculate();
    }

    setScale(scale) {
        this.scale = scale;
        this.recalculate();
    }

    getGlobalTransform() {
        if (!this.parent) {
            return this.getLocalTransform();
        }

        return mat4.multiply(
            this.parent.getGlobalTransform(),
            this.getLocalTransform()
        );
    }

    getLocalTransform() {
        return this.localTransform;
    }

    recalculate() {
        this.localTransform = mat4.translation(
            this.position[0], this.position[1], this.position[2]
        );

        this.localTransform = mat4.xRotate(this.localTransform, this.rotation[0]);
        this.localTransform = mat4.yRotate(this.localTransform, this.rotation[1]);
        this.localTransform = mat4.zRotate(this.localTransform, this.rotation[2]);

        this.localTransform = mat4.scale(
            this.localTransform, this.scale[0], this.scale[1], this.scale[2]
        );
    }

    init(position, rotation, scale) {
        this.setPosition(position ? position : [0, 0, 0]);
        this.setRotation(rotation ? rotation : [1, 1, 1]);
        this.setScale(scale ? scale : [1, 1, 1]);

        this.recalculate();
    }
}
