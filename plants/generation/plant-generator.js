export class PlantGenerator {
    constructor(fn) {
        this.fn = fn;
    }

    getVertices(height, lod) {
        this.lod = lod;

        this.vertices = [];
        let baseShape = this.fn.getBaseShape(lod);
        if (!height) {
            height = this.fn.generateHeight();
        }

        const constructionVertices = [];
        for (const v of baseShape) {
            constructionVertices.push(v.map(a => a * this.fn.calculateCurvePoint(0)));
        }

        const heightIncrement = height / lod;
        const offsetStep = 1 / lod;

        let currentHeight = heightIncrement;
        let currentOffset = offsetStep;

        for (let i = 1; i < lod + 1; i++) {
            const newBaseShape = [];
            for (const v of baseShape) {
                newBaseShape.push(v.map(a => a * this.fn.calculateCurvePoint(currentOffset)));
            }

            for (const v of newBaseShape) {
                v[1] = currentHeight;
                constructionVertices.push(v);
            }

            currentHeight += heightIncrement;
            currentOffset += offsetStep;
        }

        for (let i = 0; i < baseShape.length; i++) {
            constructionVertices.push([0, height, 0]);
        }

        const vertices = [];
        for (let level = 0; level < lod + 1; level++) {
            for (let i = 0; i < baseShape.length; i++) {
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

        this.lastGeneratedVertices = vertices;
        const vertexData = [];
        for (const vertex of vertices) {
            for (const dataPoint of vertex) {
                vertexData.push(dataPoint);
            }
        }

        this.vertices = vertexData;
        return this.vertices;
    }

    calculateSkeletonWeights() {
        const weights = [];
        let counter = 0;
        let baseWeight = 0;
        const weightStep = 1 / this.lod;
        const vertexWeightStep = this.fn.getBaseShape(this.lod).length * 6;
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
            if (counter === vertexWeightStep) {
                counter = 0;
                baseWeight += weightStep;
            }
        }

        return weights;
    }

    calculateColors(height) {
        const colors = [];
        for (const vertex of this.lastGeneratedVertices) {
            const y = vertex[1];

            const color = this.fn.calculateColorAtPoint(y / height);
            // for (let i = 0; i < 3; i++) {
            for (const c of color) {
                colors.push(c);
            }
            // }
        }

        return colors;
    }
}
