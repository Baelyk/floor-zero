/* globals Image, Player, StatBlock */

console.log('Main.js loaded');

let canvas, context, player;

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 500;

function initialize () { // eslint-disable-line no-unused-vars
  let tile = new Image();
  tile.src = 'assets/sprites/tile.png';

  canvas = document.getElementById('canvas');
  context = canvas.getContext('2d');

  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;

  let container = document.getElementById('container');
  container.style.textAlign = 'center';

  tile.onload = event => {
    let pattern = context.createPattern(tile, 'repeat');
    context.fillStyle = pattern;
    context.fillRect(0, 0, canvas.width, canvas.height);
  };
}

function startGame () {
  player = new Player();
  player.addStats(new StatBlock(20));
  player.stats.takeDamage(5);
}

initialize();
startGame();
