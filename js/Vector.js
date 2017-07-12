class Vector {
    constructor(opt) {
        opt = opt || {};
        this.x = opt.x || 0;
        this.y = opt.y || 0;
        this.level = opt.level || 0;
    }

    static add(v1, v2) {
        return new Vector({
            x: v1.x + v2.x,
            y: v1.y + v2.y,
            level: v1.level + v2.level
        });
    }

    static distance(v1, v2) {
        return Math.sqrt(Math.pow(v1.x - v2.x, 2) + Math.pow(v1.y - v2.y, 2));
    }

    get key() {
        return `${this.x}|${this.y}`;
    }
}