class LineState {
    static get HIDDEN() { return 0; }
    static get NORMAL() { return 1; }
    static get SELECTED() { return 2; }
}

class Line {
    constructor(opt) {
        opt = opt || {};
        this.lines = opt.lines;
    }

    static _draw(ctx, v, strokeStyle, lineWidth, lineDash) {
        ctx.beginPath();
        ctx.moveTo(v[0].x, v[0].y);
        ctx.bezierCurveTo(v[1].x, v[1].y, v[2].x, v[2].y, v[3].x, v[3].y);
        if (lineDash !== 'undefined') ctx.setLineDash([lineDash, 1000000]);
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
        ctx.setLineDash([0, 0]);
        ctx.closePath();
    }

    draw(ctx) {
        this.lines.forEach((line) => {
            if(LineState.HIDDEN === line.state) return;
            Line._draw(ctx, line.v, 'black', 8);
            if(LineState.NORMAL === line.state)
                Line._draw(ctx, line.v, '#333', 4);
            else if(LineState.SELECTED === line.state)
                Line._draw(ctx, line.v, '#379fd9', 4, line.lineDash);
        });
    }
}