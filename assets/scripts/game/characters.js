import { assetsCache, canvas, scale, characters, gameSpeed, gravity, gameTick } from './main.js';

class Character {
    constructor(position, sprite, size = { width: 16*scale, height: 16*scale }, speed = 0) {
        this.position = position;
        this.size = size;
        this.sprite = sprite;
        this.speed = speed;
        this.tick = 0;
    }

    draw(ctx) {
        let sprite;
        if (this.animation == undefined || this.animation == 0 || this.state == "dead") {
            if (this.state == "dead" && this.has_dead_variant && this.sprite.indexOf("_dead") == -1) {
                this.sprite += "_dead";
            }
            if (this.sprite in assetsCache) {
                sprite = assetsCache[this.sprite];
            }
            else {
                sprite = new Image();
                sprite.src = `./assets/game/${this.sprite}.png`;
                assetsCache[this.sprite] = sprite;
            }
        }
        else {
            if (this.sprite in assetsCache) {
                sprite = assetsCache[this.sprite + Math.floor(this.tick/this.animationDuration%this.animation)];
            }
            else {
                sprite = new Image();
                sprite.src = `./assets/game/${this.sprite}_${Math.floor(this.tick/this.animationDuration%this.animation)}.png`;
                assetsCache[this.sprite + Math.floor(this.tick/this.animationDuration%this.animation)] = sprite;
            }
        }

        ctx.drawImage(sprite, this.position.x, canvas.height - 32*scale - this.position.y, this.size.width, this.size.height);
    }
}

class Player extends Character {
    constructor(sprite, position={ x: 32*scale, y: 0 }) {
        super(position, sprite);
        this.yVelocity = 0;
        this.yAcceleration = 0;
        this.animation = 8;
        this.animationDuration = 10;
        this.has_dead_variant = true;
    }

    update() {
        this.tick++;
        this.yVelocity += this.yAcceleration;
        this.position.y += this.yVelocity*scale;
        this.yAcceleration = gravity;
        if (this.position.y < 0 && this.state != "dead") {
            this.position.y = 0;
            this.yVelocity = 0;
            this.yAcceleration = 0;
        }
        else if (this.position.y < -2*this.size.height && this.state == "dead") {
            this.yVelocity = 0;
            this.yAcceleration = 0;
        }

        if (this.state != "dead") {
            if (this.sprite.indexOf("_dead") != -1) {
                this.sprite = this.sprite.replace("_dead", "");
            }
            characters.filter(character => character !== this && character.state != 'dead').forEach(character => {
                if (character.isTouching(this)) {
                    if (character instanceof Enemy) {
                        this.state = "dead";
                        this.yAcceleration = 2;
                    }
                }
            });
        }
    }
    
    jump() {
        if (this.position.y === 0) {
            this.yAcceleration = 3;
        }
    }

    relive() {
        this.state = "alive";
        this.position.y = 0;
        this.yVelocity = 0;
        this.yAcceleration = 0;
    }
}

class Enemy extends Character {
    constructor(position, sprite, size = { width: 16*scale, height: 16*scale }, speed = 0) {
        super(position, sprite, size=size, speed=speed);
    }

    update() {
        this.tick++;
        if (this.state == "dead") {
            this.position.x -= gameSpeed * scale;
        }
        else {
            this.position.x -= (gameSpeed + this.speed) * scale;
        }
        if (this.position.x < -this.size.width) {
            characters.splice(characters.indexOf(this), 1);
        }
    }
}

class Bullet extends Enemy {
    constructor(position) {
        super(position, 'bullet', { width: 16*scale, height: 16*scale }, .5);
    }

    isTouching(player) {
        if (player.position.x + player.size.width > this.position.x &&
            player.position.x < this.position.x + this.size.width*.2 &&
            player.position.y < this.position.y + this.size.height*.8 &&
            player.position.y + player.size.height > this.position.y ||
            player.position.x + player.size.width > this.position.x &&
            player.position.x < this.position.x + this.size.width &&
            player.position.y < this.position.y + this.size.height*.2 &&
            player.position.y + player.size.height > this.position.y) {
                return true;
        }
        else if (player.position.x < this.position.x + this.size.width &&
                 player.position.x + player.size.width > this.position.x &&
                 player.position.y < this.position.y + this.size.height &&
                 player.position.y + player.size.height > this.position.y){
            this.state = "dead";
            this.size.height /= 2;
            this.position.y -= this.size.height;
            player.yAcceleration = 2;
            return false;
        }
    }
}

class Goomba extends Enemy {
    constructor(position) {
        super(position, 'goomba', { width: 16*scale, height: 16*scale }, -.2);
        this.animation = 2;
        this.animationDuration = 15;
    }

    isTouching(player) {
        // return true if the player hitbox is in the first left third of the bullet
        if (player.position.x + player.size.width > this.position.x &&
            player.position.x < this.position.x + this.size.width*.2 &&
            player.position.y < this.position.y + this.size.height*.8 &&
            player.position.y + player.size.height > this.position.y) {
                return true;
        }
        else if (player.position.x < this.position.x + this.size.width &&
                 player.position.x + player.size.width > this.position.x &&
                 player.position.y < this.position.y + this.size.height &&
                 player.position.y + player.size.height > this.position.y){
            this.state = "dead";
            this.size.height /= 2;
            this.position.y -= this.size.height;
            player.yAcceleration = 2;
            return false;
        }
    }
}

class Banana extends Enemy {
    constructor(position) {
        super(position, 'banana', { width: 16*scale, height: 16*scale }, 0);
    }

    isTouching(player) {
        // return true if the player hitbox is in the character hitbox
        return (player.position.x < this.position.x + this.size.width*.7 &&
                player.position.x + player.size.width > this.position.x + this.size.width*.2 &&
                player.position.y < this.position.y + this.size.height &&
                player.position.y + player.size.height > this.position.y);
    }
}

export { Character, Player, Enemy, Bullet, Goomba, Banana };