class PlayTile extends Tile {
    constructor(opt) {
        opt = opt || {};
        super(opt);
        this.line = new Line(opt.line);
        this.entryIndex = opt.entryIndex || 0;
        this.rot = opt.rot || 0;
        this.targetRot = opt.targetRot || this.rot;
        this.targetPos = new Vector(opt.targetPos || this.pos);
        this.swapState = opt.swapState || 0;
    }

    _draw(ctx) {
        ctx.translate(this.size.x / 2, this.size.y / 2);
        ctx.rotate(this.rot * Math.PI / 180);
        ctx.translate(-this.size.x / 2, -this.size.y / 2);
        super._draw(ctx);
        this.line.draw(ctx);
    }

    update() {
        if(this.targetRot > this.rot) this.rot += 15;
        else if(this.targetRot < this.rot) this.rot -= 15;

        if(this.swapState === 1) {
            let xSpeed = 100,
                ySpeed = Math.abs((this.targetPos.y - this.pos.y) / (this.targetPos.x - this.pos.x)) * xSpeed;

            if(this.targetPos.x + xSpeed < this.pos.x) this.pos.x -= xSpeed;
            else if(this.targetPos.x - xSpeed > this.pos.x) this.pos.x += xSpeed;

            if(this.targetPos.y + ySpeed < this.pos.y) this.pos.y -= ySpeed;
            else if(this.targetPos.y - ySpeed > this.pos.x) this.pos.y += ySpeed;
            else {
                this.pos = new Vector(this.targetPos);
                this.swapState = 2;
            }
        }
    }
}
