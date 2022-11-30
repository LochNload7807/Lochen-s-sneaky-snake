//@ts-check
/** @type {HTMLCanvasElement} */ //@ts-ignore canvas is an HTMLCanvasElement
const canvas = document.getElementById("game-canvas");
/** @type {CanvasRenderingContext2D} */ //@ts-ignore canvas is an HTMLCanvasElement
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

let game = {
	gridSize: 20,
	refreshRate: 500, // milliseconds
};

class Player {
	/**
	 * @param {number} x
	 * @param {number} y
	 * @param {CanvasRenderingContext2D} ctx
	 */
	constructor(x, y, ctx) {
		this.x = x;
		this.y = y;
		this.w = game.gridSize;
		this.h = this.w;
		this.ctx = ctx;
		this.segments = [new Segment(this.x, this.y, "yellow", ctx)];
	}

	update() {}
	draw() {
		this.segments.forEach((s) => {});
	}
}

class Segment {
	/**
	 * @param {number} x
	 * @param {number} y
	 * @param {string} color
	 * @param {CanvasRenderingContext2D} ctx
	 */
	constructor(x, y, color, ctx) {
		this.x = x;
		this.y = y;
		this.w = game.gridSize;
		this.h = this.w;
		this.color = color;
		this.ctx = ctx;
	}

	update() {}

	draw() {
		this.ctx.fillStyle = this.color;
		this.ctx.fillRect(this.x, this.y, this.w, this.h);
	}
}

let p1 = new Player(5 * game.gridSize, 5 * game.gridSize, ctx);

let currentTime = 0;

function gameLoop(timestamp) {
	let elaspedTime = timestamp - currentTime;
	currentTime = timestamp;

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
