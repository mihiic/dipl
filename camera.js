import {mat4} from "./mat4.js";

export class Camera3D {
    constructor(fov, aspect, near, far) {
        this.position = [0, 0, 0];
        this.target = [0, 0, 0];
        this.upVector = [0, 1, 0];
        this.dirty = true;

        this.projection = null;
        this.pvMatrix = null;
        this.calculateProjectionMatrix(fov, aspect, near, far);
    }

    setPosition(position) {
        this.position = position;
        this.dirty = true;
    }

    setTarget(target) {
        this.target = target;
        this.dirty = true;
    }

    projectionViewMatrix() {
        if (this.pvMatrix || this.dirty) {
            this.dirty = false;
            const cameraMatrix = mat4.lookAt(this.position, this.target, this.upVector);
            this.pvMatrix = mat4.multiply(this.projection, mat4.inverse(cameraMatrix));
        }

        return this.pvMatrix;
    }

    calculateProjectionMatrix(fov, aspect, near, far) {
        this.projection = mat4.perspective(
            fov, aspect, near, far
        );
    }
}
