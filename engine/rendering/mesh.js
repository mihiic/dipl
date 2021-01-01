import {vec3} from "../math/vec3.js";
import {mat4} from "../math/mat4.js";

export class Mesh {
    constructor(gl, program) {
        this.gl = gl;
        this.program = program;
        this.attributes = {};
        this.uniforms = {};
        this.properties = {
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            scale: [1, 1, 1]
        }

        this.gl.useProgram(this.program);

        let modelMatrix = null;
        this.calculateModelMatrix();
        this.initSkeleton();
    }

    render(camera) {
        this.gl.useProgram(this.program);
        const verticesAttribute = this.attributes['a_position'];

        this.setRenderMatrices(camera.projectionViewMatrix());
        this.fillUniforms();
        this.fillBuffers();

        this.gl.drawArrays(
            this.gl.TRIANGLES,
            0,
            verticesAttribute.currentData.length / verticesAttribute.numComponents
        );
    }

    update() {
    }

    setColor(color) {
        this.setUniform('u_color', 'uniform4fv', color);
    }

    // temporarily calculates it's own
    setSkeletonWeights(weights) {
        if (!this.attributes['a_weights']) {
            this.createAttributeBuffer('a_weights', 1);
        }

        weights = [];
        let counter = 0;
        let baseWeight = 0;
        const weightStep = 1 / 6;
        let botTopCounter = 0;
        const order = [0, 0, 1, 1, 0, 1];
        for (let i = 0; i < 144; i++) {

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

        this.fillAttributeBuffer('a_weights', weights);
    }

    initSkeleton() {
        const boneMatrix = mat4.translation(0, 0, 0);
        const uBone = this.uniform('u_bone');

        this.gl.uniformMatrix4fv(
            uBone.location,
            false,
            boneMatrix
        );
    }

    setSkeletonRotation(angle) {
        let boneMatrix = mat4.zRotation(angle);
        const uBone = this.uniform('u_bone');

        this.gl.uniformMatrix4fv(
            uBone.location,
            false,
            boneMatrix
        );
    }

    setReverseLightDirection(light) {
        this.setUniform('u_reverseLightDirection', 'uniform3fv', light);
    }

    setUniform(shaderBinding, setter, value) {
        const uni = this.uniform(shaderBinding);
        uni.data = value;
        uni.setter = setter;

        this.gl[setter](uni.location, value);
    }

    uniform(shaderBinding) {
        if (this.uniforms[shaderBinding]) {
            return this.uniforms[shaderBinding];
        }

        this.uniforms[shaderBinding] = {
            location: this.gl.getUniformLocation(this.program, shaderBinding),
            data: null,
            setter: null
        };
        return this.uniforms[shaderBinding];
    }

    setRotation(rotation) {
        this.properties.rotation = rotation;
        this.calculateModelMatrix();
    }

    setPosition(position) {
        this.properties.position = position;
        this.calculateModelMatrix();
    }

    setScale(scale) {
        this.properties.scale = scale;
        this.calculateModelMatrix();
    }

    setVertices(vertices) {
        if (!this.attributes['a_position']) {
            this.createAttributeBuffer('a_position', 3);
        }

        this.fillAttributeBuffer('a_position', vertices);
    }

    setNormals(normals) {
        if (!normals) {
            normals = this.calculateNormals(
                this.attributes['a_position'].currentData
            );
        }

        if (!this.attributes['a_normal']) {
            this.createAttributeBuffer('a_normal', 3);
        }

        this.fillAttributeBuffer('a_normal', normals);

    }

    createAttributeBuffer(shaderBinding, size, type) {
        if (!type) {
            type = this.gl.FLOAT;
        }

        const buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);

        this.attributes[shaderBinding] = {
            buffer: buffer,
            attribLocation: this.gl.getAttribLocation(this.program, shaderBinding),
            currentData: [],
            numComponents: size,
            type: type
        };

        const attr = this.attributes[shaderBinding];
        this.gl.enableVertexAttribArray(attr.attribLocation);
        this.gl.vertexAttribPointer(
            attr.attribLocation,
            attr.numComponents,
            attr.type,
            false,
            0,
            0
        );
    }

    fillBuffers() {
        for (const key in this.attributes) {
            const attr = this.attributes[key];
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, attr.buffer);

            this.fillAttributeBuffer(key, attr.currentData);
        }
    }

    fillAttributeBuffer(shaderBinding, data) {
        const attr = this.attributes[shaderBinding];
        attr.currentData = data;

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, attr.buffer);
        this.gl.bufferData(
            this.gl.ARRAY_BUFFER,
            new Float32Array(attr.currentData),
            this.gl.STATIC_DRAW
        );
    }

    calculateNormals(points) {
        let face = [];
        const normals = [];
        for (const point of points) {
            face.push(point);

            // 3 data points per vertex
            if (face.length === 9) {
                const normal = vec3.normalFromPoints(
                    face.slice(0, 3), face.slice(3, 6), face.slice(6, 9)
                );

                // add 3 normal data points per vertex
                for (let i = 0; i < 3; i++) {
                    normals.push(normal[0]);
                    normals.push(normal[1]);
                    normals.push(normal[2]);
                }

                face = [];
            }
        }

        return normals;
    }

    calculateModelMatrix() {
        this.modelMatrix = mat4.translation(
            this.properties.position[0],
            this.properties.position[1],
            this.properties.position[2]
        );
        this.modelMatrix = mat4.xRotate(this.modelMatrix, this.properties.rotation[0]);
        this.modelMatrix = mat4.yRotate(this.modelMatrix, this.properties.rotation[1]);
        this.modelMatrix = mat4.zRotate(this.modelMatrix, this.properties.rotation[2]);

        this.modelMatrix = mat4.scale(
            this.modelMatrix,
            this.properties.scale[0],
            this.properties.scale[1],
            this.properties.scale[2]
        );
    }

    setRenderMatrices(projectionView) {
        this.gl.uniformMatrix4fv(
            this.uniform('u_worldViewProjection').location,
            false,
            mat4.multiply(projectionView, this.modelMatrix)
        );

        this.gl.uniformMatrix4fv(
            this.uniform('u_worldInverseTranspose').location,
            false,
            mat4.transpose(mat4.inverse(this.modelMatrix))
        );
    }

    fillUniforms() {
        for (const key in this.uniforms) {
            const uni = this.uniforms[key];
            if (!uni.data) {
                continue;
            }

            this.gl[uni.setter](uni.location, uni.data);
        }
    }
}

