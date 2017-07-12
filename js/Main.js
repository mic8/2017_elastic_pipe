let $ = document.querySelector.bind(document),
    canvas = $('canvas'),
    image = new Image(),
    tileFactory = new TileFactory(),
    lineFactory = new LineFactory(),
    game = null,
    isCtrl = false;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

image.onload = () => {
    game = new Game(canvas, image, 3, tileFactory, lineFactory);
    game.init();
    game.draw();
};
image.src = 'assets/tiles.png';

window.onkeydown = (e) => {
    if(null === game) return;
    isCtrl = false;

    let code = e.keyCode;

    if(code === 37 || code === 39) game.rotateActiveTile(code - 38);
    else if(code === 83) game.swap();
    else if(code === 13 || code === 32) game.move();

    if(code === 17) isCtrl = true;
};