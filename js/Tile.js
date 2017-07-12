class Tile {
    constructor(opt) {
        opt = opt || {};
        this.image = opt.image;
        this.pos = new Vector(opt.pos);
        this.size = new Vector(opt.size || { x: 115, y: 100 });
        this.sourcePos = new Vector(opt.sourcePos);
        this.originalPos = new Vector(opt.originalPos || this.pos);
    }

    get key() { return this.originalPos.key }

    _draw(ctx) {
        ctx.drawImage(this.image, this.sourcePos.x, this.sourcePos.y, this.size.x, this.size.y, 0, 0, this.size.x, this.size.y);
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        this._draw(ctx);
        ctx.restore();
    }
}