class TileFactory {
    get distance() {
        return [
            new Vector({x: 0, y: 100}), new Vector({x: 87, y: 50}), new Vector({x: 87, y: -50}),
            new Vector({x: 0, y: -100}), new Vector({x: -87, y: -50}), new Vector({x: -87, y: 50})
        ];
    }

    get tileSize() {
        return new Vector({x: 115, y: 100});
    }

    newPlayableTile(image, pos, line, entryIndex) {
        return new PlayTile({
            image: image,
            pos: pos,
            line: line,
            entryIndex: entryIndex,
            sourcePos: new Vector({x: 345})
        });
    }

    generate(image, radius, boundaryMap, tiles) {
        let startPos = new Vector(),
            size = this.tileSize,
            openList = [startPos],
            closedMap = {},
            counter = 0;

        closedMap[startPos.key] = 1;

        while(openList.length > 0 && counter++ < 1000000) {
            let pos = openList.shift();
            this.distance.forEach((d) => {
                let newPos = Vector.add(d, pos);
                if (closedMap[newPos.key]) return;
                closedMap[newPos.key] = 1;
                if (newPos.level === radius)
                    boundaryMap[newPos.key] = new Tile({
                        image: image,
                        pos: newPos,
                        sourcePos: new Vector({x: Math.floor(Math.random() * 5) * size.x, y: size.y}),
                        size: size
                    });
                else
                    tiles.push(new Tile({
                        image: image,
                        pos: newPos,
                        sourcePos: new Vector({x: Math.floor(Math.random() * 3) * size.x}),
                        size: size
                    }));

                if (newPos.level < radius) {
                    newPos.level++;
                    openList.push(newPos);
                }
            });
        }
    }
}