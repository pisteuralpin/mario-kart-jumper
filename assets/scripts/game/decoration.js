import { canvas, scale, gameSpeed, decorations } from './main.js';
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

    draw(context) {
        const sprite = new Image();
        sprite.src = `./assets/game/${this.sprite}.png`;
        context.drawImage(sprite, this.position.x, canvas.height - 32*scale - this.position.y, this.size.width, this.size.height);
    }
}

class Bricks extends Decoration {
    constructor(position) {
        super(position, 'bricks');
    }

    update() {
        this.position.x -= gameSpeed * scale;
        if (this.position.x < -this.size.width) {
            this.position.x = canvas.width-1*scale;
        }
    }
}

export { Decoration, Bricks };