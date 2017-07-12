class Game {
    constructor(canvas, image, radius, tileFactory, lineFactory) {
        this.image = image;
        this.radius = radius;
        this.tileFactory = tileFactory;
        this.lineFactory = lineFactory;

        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;

        this.lost = false;
        this.paused = false;
        this.flag = true;

        this.scale = Math.min(
            this.width / ((3 + this.radius * 2) * this.tileFactory.tileSize.x),
            this.height / ((3 + this.radius * 2) * this.tileFactory.tileSize.y)
        );

        this.centerPos = new Vector({
            x: this.width / this.scale / 2 - this.tileFactory.tileSize.x / 2,
            y: this.height / this.scale / 2 - this.tileFactory.tileSize.y / 2
        });
    }

    init() {
        this.animatingTiles = [];
        this.tiles = [];
        this.boundaryMap = {};
        this.playableMap = {};

        let centerTile = new Tile({
            image: this.image,
            sourcePos: new Vector({x: 460})
        });

        this.boundaryMap[centerTile.key] = centerTile;
        this.tileFactory.generate(this.image, this.radius, this.boundaryMap, this.tiles);

        let startPos = new Vector(this.tileFactory.distance[3]),
            swapPos = new Vector({
                x: -this.centerPos.x,
                y: this.height / this.scale - this.centerPos.y - this.tileFactory.tileSize.y
            });

        this.selectedPlayTile = this.tileFactory.newPlayableTile(this.image, startPos, this.lineFactory.newLine());
        this.swapTile = this.tileFactory.newPlayableTile(this.image, swapPos, this.lineFactory.newLine());

        this.playableMap[this.selectedPlayTile.key] = this.selectedPlayTile;
        this.playableMap[this.swapTile.key] = this.swapTile;
    }

    draw() {
        let ctx = this.ctx;
        ctx.clearRect(0, 0, this.width, this.height);
        ctx.scale(this.scale, this.scale);
        ctx.translate(this.centerPos.x, this.centerPos.y);
        this.tiles.forEach((tile) => { tile.draw(ctx); });
        for(let key in this.boundaryMap) { this.boundaryMap[key].draw(ctx); }
        for(let key in this.playableMap) { this.playableMap[key].draw(ctx); }
        ctx.translate(-this.centerPos.x, -this.centerPos.y);
        ctx.scale(1 / this.scale, 1 / this.scale);

        requestAnimationFrame(this.draw.bind(this));

        this.selectedPlayTile.update();
        this.swapTile.update();

        if(this.selectedPlayTile.swapState === 2 && this.swapTile.swapState === 2)
            this.onSwapDone();

        if(this.animatingTiles.length > 0) {
            let data = this.animatingTiles[0];
            let line = this.playableMap[data.key].line.lines[data.index];
            line.lineDash += 5;
            if(line.lineDash > line.curveLength) {
                line.lineDash += 1000;
                this.animatingTiles.shift();
                if(this.animatingTiles.length === 0)
                    this.onAnimatingTilesDone();
            }
        }
    }

    rotateActiveTile(direction) {
        if(this.lost) return;

        this.selectedPlayTile.targetRot += direction * 60;
    }

    swap() {
        if(this.lost) return;

        this.selectedPlayTile.swapState = this.swapTile.swapState = 1;
        if(this.selectedPlayTile.originalPos.key === this.selectedPlayTile.targetPos.key) {
            this.selectedPlayTile.targetPos = new Vector(this.swapTile.originalPos);
            this.swapTile.targetPos = new Vector(this.selectedPlayTile.originalPos);
        } else {
            this.selectedPlayTile.targetPos = new Vector(this.selectedPlayTile.originalPos);
            this.swapTile.targetPos = new Vector(this.swapTile.originalPos);
        }
    }

    move() {
        if(this.lost) return;

        let acc = 1,
            nextEntryIndex = [7, 6, 9, 8, 11, 10, 1, 0, 3, 2, 5, 4],
            counter = 0;

        while(counter++ < 100000) {
            let entryIndex = this.selectedPlayTile.entryIndex;
            entryIndex = (entryIndex + this.selectedPlayTile.targetRot / 30) % 12;
            if(entryIndex < 0) entryIndex += 12;

            let line = this.selectedPlayTile.line.lines.find((l) => {
                return l.points.indexOf(entryIndex) !== -1;
            });

            line.state = LineState.SELECTED;

            let stopIndex = line.points[1];
            if(entryIndex !== line.points[0]) {
                stopIndex = line.points[0];
                line.v.reverse();
            }

            this.animatingTiles.push({
                key: this.selectedPlayTile.key,
                index: this.selectedPlayTile.line.lines.indexOf(line)
            });

            stopIndex = (stopIndex - this.selectedPlayTile.targetRot / 30) % 12;
            if(stopIndex < 0) stopIndex += 12;

            let newPos = Vector.add(this.selectedPlayTile.targetPos, this.tileFactory.distance[Math.floor(stopIndex / 2)]);

            if(this.boundaryMap[newPos.key]) {
                this.lost = true;
                break;
            } else if(this.playableMap[newPos.key]) {
                this.selectedPlayTile = this.playableMap[newPos.key];
                this.selectedPlayTile.entryIndex = nextEntryIndex[stopIndex];
            } else {
                this.selectedPlayTile = this.tileFactory.newPlayableTile(this.image, newPos, this.lineFactory.newLine(), nextEntryIndex[stopIndex]);
                this.playableMap[this.selectedPlayTile.key] = this.selectedPlayTile;
                break;
            }
        }
    }

    onSwapDone() {
        this.selectedPlayTile.swapState = this.swapTile.swapState = 0;
        if(this.selectedPlayTile.originalPos.key === this.selectedPlayTile.targetPos.key) return;

        let temp = this.selectedPlayTile;
        this.selectedPlayTile = this.swapTile;
        this.swapTile = temp;

        this.selectedPlayTile.entryIndex = this.swapTile.entryIndex;

        let temp2 = this.selectedPlayTile.originalPos;
        this.selectedPlayTile.originalPos = this.swapTile.originalPos;
        this.swapTile.originalPos = temp2;

        this.playableMap[this.selectedPlayTile.key] = this.selectedPlayTile;
        this.playableMap[this.swapTile.key] = this.swapTile;
    }

    onAnimatingTilesDone() {
        if(!this.lost) return;

        for(var key in this.playableMap) {
            if(this.swapTile.key === key) continue;
            this.playableMap[key].line.lines.filter((line) => {
                return LineState.NORMAL === line.state;
            }).forEach((line) => {
                line.state = LineState.HIDDEN;
            });
        }
    }
}