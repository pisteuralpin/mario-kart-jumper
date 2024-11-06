import { Player, Bullet, Goomba, Banana } from './characters.js';
import { Bricks, Cloud } from './decoration.js';

const scale = 4;
const gravity = -.15;
let initialGameSpeed = 1.5;
let maxGameSpeed = 3;
let gameSpeed = initialGameSpeed;
let gameTick = 0;
let grayscale = -300;

let assetsCache = {};

const canvas = document.getElementById('game');
canvas.width = 256*scale;
canvas.height = 64*scale;
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

const player = new Player('mario');

let characters = [];
let decorations = [];

for(let i = 0; i <= 18; i++) {
    decorations.push(new Bricks({ x: i * 16*scale, y: -16*scale }));
}

function action() {
    if (player.state !== 'dead') {
        player.jump();
    }
    else {
        gameTick = 0;
        grayscale = -300;
        player.relive();
        characters = [];
    }
}

document.addEventListener('keydown', event => {
    if (event.key === ' ' || event.key === 'ArrowUp' || event.key === 'w' || event.key === 'z') {
        action();
    }
});
document.addEventListener('mousedown', () => { action(); });
document.addEventListener('touchstart', () => { action(); });

window.setInterval(function () {
    ctx.beginPath();
    ctx.fillStyle = '#a1adff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.closePath();

    ctx.beginPath();
    ctx.fillStyle = '#de5918';
    ctx.fillRect(0, canvas.height-16*scale, canvas.width, 16*scale);
    ctx.closePath();

    if (gameTick !=0 && gameTick % 140 < gameSpeed && player.state != 'dead') {
        const choice = Math.random();
        if (choice < 0.4) {
            characters.push(new Goomba({ x: 256*scale, y: 0 }));
        }
        else if (choice < 0.6) {
            characters.push(new Banana({ x: 256*scale, y: 0 }));
        }
        else {
            characters.push(new Bullet({ x: 256*scale, y: Math.floor(Math.random() * 4) * 8 *scale })); //
        }
    }

    if (gameTick !=0 && gameTick % 80 < gameSpeed && player.state != 'dead') {
        if (Math.random() < 0.5) {
            decorations.push(new Cloud({ x: 256*scale, y: (8 + Math.floor(Math.random() * 4) * 8) *scale }));
        }
    }

    decorations.forEach(decoration => {
        decoration.update();
    });
    decorations.forEach(decoration => {
        decoration.draw(ctx);
    });

    player.update();
    characters.forEach(character => {
        character.update();
    });
    characters.forEach(character => {
        character.draw(ctx);
    });
    player.draw(ctx);
    gameTick += gameSpeed;

    ctx.beginPath();
    ctx.fillStyle = '#000000';
    ctx.font = '24px SuperMario';
    ctx.textAlign = 'left';
    ctx.fillText(`${String(Math.floor(gameTick/16)).padStart(5, "0")}`, canvas.width-90, 30);
    if (localStorage.getItem('highscore') !== null) {
        ctx.fillStyle = '#5a5a5a';
        ctx.fillText(`HI ${String(localStorage.getItem('highscore')).padStart(5, "0")}`, canvas.width-220, 30);
    }

    if (player.state === 'dead') {
        ctx.fillStyle = '#000000';
        ctx.font = '48px SuperMario';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width/2, canvas.height/2);

        ctx.filter = `grayscale(${grayscale}%)`;
        if (grayscale < 100) {
            grayscale += 10;
        }

        gameSpeed = 0;

        if (localStorage.getItem('highscore') < Math.floor(gameTick/16) || localStorage.getItem('highscore') === null) {
            localStorage.setItem('highscore', Math.floor(gameTick/16));
        }
    }
    else {
        ctx.filter = 'none';
        gameSpeed = Math.min(initialGameSpeed + gameTick/16/500, maxGameSpeed);
    }
}, 1000 / 60);

export { scale, gravity, gameSpeed, gameTick, assetsCache, canvas, ctx, characters, decorations };