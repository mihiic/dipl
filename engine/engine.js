class EngineImplementation {
    constructor() {
        this.currentId = 0;
    }

    initialize(
        canvasQuery,
        resolution,
        frameRate = 60,
        faceCulling = true,
        depthTest = true,
        clearColor=[1, 1, 1, 0]
    ) {
        this.initializeContext(canvasQuery, resolution, faceCulling, depthTest, clearColor);
        this.initializeUpdateCycle(frameRate);

        this.clearColor = clearColor;
    }

    // update logic
    update(elapsed) {
        if (this.root) {
            this.root.update(elapsed);
        }
    }

    render() {
        this.gl.clear(this.clearBit);

        if (this.root) {
            this.root.render();
        }
    }

    updateClock() {
        const frameStart = Date.now();
        const elapsedTime = frameStart - this.lastFrameTime;

        if (elapsedTime > this.frameTime) {
            if (this.world) {
                this.world.step(this.frameTime / 1000);
            }
            this.update(elapsedTime / 1000);
            this.render();

            this.lastFrameTime = frameStart;
        }
        requestAnimationFrame(this.updateClock.bind(this));
    }

    setRootScene(scene) {
        this.root = scene;
    }

    setMainCamera(camera) {
        this.camera = camera;
    }

    initializeContext(canvasQuery, resolution, faceCulling, depthTest, clearColor) {
        const canvas = document.querySelector(canvasQuery);
        this.gl = canvas.getContext('webgl');

        canvas.width = resolution[0];
        canvas.height = resolution[1];

        this.gl.viewport(0, 0, resolution[0], resolution[1]);

        this.clearBit = this.gl.COLOR_BUFFER_BIT;
        if (depthTest) {
            this.clearBit |= this.gl.DEPTH_BUFFER_BIT;
            this.gl.enable(this.gl.DEPTH_TEST);
        }

        if (faceCulling) {
            this.gl.enable(this.gl.CULL_FACE);
        }

        this.gl.clearColor(
            1,
            1,
            1,
            0 // default to opaque
        );
    }

    initializeUpdateCycle(frameRate) {
        this.lastFrameTime = Date.now();

        // browser runs at 60 frames, adding -1 to offset rounding errors
        this.frameTime = 1000.0 / frameRate - 1;
        this.updateClock();
    }

    initializePhysicsWorld() {
        this.world = new OIMO.World(1, new OIMO.Vec3(0, -9.8, 0));
    }

    generateId() {
        this.currentId++;
        return this.currentId;
    }
}

// singleton wrapper
export const Engine = (function() {
    const _instance = new EngineImplementation();
    return {
        instance: function() {
            return _instance;
        }
    }
})();
