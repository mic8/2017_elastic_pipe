class LineFactory {
    constructor() {
        this.points = [
            new Vector({ x: 47, y: 100 }), new Vector({ x: 67, y: 100 }), new Vector({ x: 97, y: 83 }), new Vector({ x: 105, y: 67 }),
            new Vector({ x: 105, y: 33 }), new Vector({ x: 97, y: 17 }), new Vector({ x: 67, y: 0 }), new Vector({ x: 47, y: 0 }),
            new Vector({ x: 19, y: 17 }), new Vector({ x: 9, y: 33 }), new Vector({ x: 9, y: 67 }), new Vector({ x: 19, y: 83 })
        ];

        this.controlPoints = [
            new Vector({ x: 47, y: 67 }), new Vector({ x: 67, y: 67 }), new Vector({ x: 75, y: 50 }),
            new Vector({ x: 67, y: 33 }), new Vector({ x: 47, y: 33 }), new Vector({ x: 35, y: 50 })
        ];
    }

    static calcBezierCurveLength(v1, v2, v3, v4) {
        return Math.floor((Vector.distance(v1, v2) + Vector.distance(v2, v3) + Vector.distance(v3, v4) + Vector.distance(v1, v4)) / 2);
    }

    newLine() {
        let lines = [],
            indices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

        indices.sort(() => { return Math.random() < .5; });

        while(indices.length > 0) {
            let startIndex = indices.shift(),
                endIndex = indices.shift(),
                startControlIndex = Math.floor((startIndex + 1) / 2) % this.controlPoints.length,
                endControlIndex = Math.floor((endIndex + 1) / 2) % this.controlPoints.length,
                v = [this.points[startIndex], this.controlPoints[startControlIndex], this.controlPoints[endControlIndex], this.points[endIndex]];

            lines.push({
                v: v,
                state: LineState.NORMAL,
                lineDash: 0,
                points: [startIndex, endIndex],
                curveLength: LineFactory.calcBezierCurveLength(v[0], v[1], v[2], v[3])
            });
        }

        return new Line({ lines: lines });
    }
}