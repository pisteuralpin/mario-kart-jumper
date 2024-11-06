import { assetsCache, canvas, scale, gameSpeed, decorations, gameTick } from './main.js';
import { Player } from './characters.js';

class Decoration {
    constructor(position, sprite, size = { width: 16*scale, height: 16*scale }) {
        this.position = position;
        this.size = size;
        this.sprite = sprite;
    }

    update() {
        this.position.x -= gameSpeed;
        if (this.position.x <= -this.size.width) {
            decorations.splice(decorations.indexOf(this), 1);
        }
    }

    draw(ctx) {
        let sprite;
        if (this.sprite in assetsCache) {
            sprite = assetsCache[this.sprite];
        }
        else {
            sprite = new Image();
            sprite.src = `./assets/game/${this.sprite}.png`;
            assetsCache[this.sprite] = sprite;
        }
        ctx.drawImage(sprite, this.position.x, canvas.height - 32*scale - this.position.y, this.size.width, this.size.height);
    }
}

class Bricks extends Decoration {
    constructor(position) {
        super(position, 'bricks');
    }

    update() {
        this.position.x -= gameSpeed * scale;
        if (this.position.x <= -this.size.width) {
            this.position.x = Math.max(decorations.filter(decoration => decoration instanceof Bricks).map(decoration => decoration.position.x).reduce((a, b) => Math.max(a, b), 0) + 16*scale - 2.8*gameSpeed, canvas.width);
        }
    }
}

class Cloud extends Decoration {
    constructor(position) {
        super(position, 'cloud');
    }

    update() {
        this.position.x -= gameSpeed * .8 * scale;
        if (this.position.x < -this.size.width) {
            decorations.splice(decorations.indexOf(this), 1);
        }
    }
}

export { Decoration, Bricks, Cloud };