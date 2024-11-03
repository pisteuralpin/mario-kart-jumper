import { Player, Bullet, Goomba, Banana } from './characters.js';
import { Bricks } from './decoration.js';

const scale = 4;
const gravity = -.15;
let gameSpeed = 3;
let gameTick = 0;

const canvas = document.getElementById('game');
canvas.width = 256*scale;
canvas.height = 64*scale;
const context = canvas.getContext('2d');
context.imageSmoothingEnabled = false;

const player = new Player('mario');

let characters = [player];
let decorations = [];

for(let i = 0; i <= 16; i++) {
    decorations.push(new Bricks({ x: i * 16*scale, y: -16*scale }));
}

document.addEventListener('keydown', event => {
    if (event.key === ' ' || event.key === 'ArrowUp') {
        if (player.state !== 'dead') {
            player.jump();
        }
    }
    if (event.key === 'ArrowDown') {
        player.yAcceleration = 10*gravity;
    }
});
canvas.addEventListener('click', () => {
    if (player.state !== 'dead') {
        player.jump();
    }
    else {
        gameTick = 0;
        player.state = 'alive';
        characters = [player];
    }
});

window.setInterval(function () {
    context.beginPath();
    context.fillStyle = '#a1adff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.closePath();

    if (gameTick % 50/gameSpeed === 0 && player.state != 'dead') {
        if (Math.random() < 0.3) {
            characters.push(new Goomba({ x: 256*scale, y: 0 }));
        }
        else if (Math.random() < 0.6) {
            characters.push(new Banana({ x: 256*scale, y: 0 }));
        }
        else {
            characters.push(new Bullet({ x: 256*scale, y: Math.floor(Math.random() * 4) * 8 *scale }));
        }
    }

    decorations.forEach(decoration => {
        decoration.update();
    });
    decorations.forEach(decoration => {
        decoration.draw(context);
    });

    characters.forEach(character => {
        character.update();
    });
    characters.forEach(character => {
        character.draw(context);
    });
    gameTick += gameSpeed;

    context.beginPath();
    context.fillStyle = '#000000';
    context.font = '24px SuperMario';
    context.textAlign = 'left';
    context.fillText(`${String(Math.floor(gameTick/16)).padStart(5, "0")}`, canvas.width-90, 30);
    if (localStorage.getItem('highscore') !== null) {
        context.fillStyle = '#5a5a5a';
        context.fillText(`HI ${String(localStorage.getItem('highscore')).padStart(5, "0")}`, canvas.width-220, 30);
    }

    if (player.state === 'dead') {
        context.fillStyle = '#000000';
        context.font = '48px SuperMario';
        context.textAlign = 'center';
        context.fillText('GAME OVER', canvas.width/2, canvas.height/2);
        context.filter = 'grayscale(100%)';
        gameSpeed = 0;

        if (localStorage.getItem('highscore') < Math.floor(gameTick/16) || localStorage.getItem('highscore') === null) {
            localStorage.setItem('highscore', Math.floor(gameTick/16));
        }
    }
    else {
        context.filter = 'none';
        gameSpeed = 1.5 + Math.floor(gameTick/16/500);
    }
}, 1000 / 60);

export { scale, gravity, gameSpeed, gameTick, canvas, context, characters, decorations };