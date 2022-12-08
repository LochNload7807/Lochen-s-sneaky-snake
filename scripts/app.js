//@ts-check
/** @type {HTMLCanvasElement} */ //@ts-ignore canvas is an HTMLCanvasElement
const canvas = document.getElementById("game-canvas");
/** @type {CanvasRenderingContext2D} */ //@ts-ignore canvas is an HTMLCanvasElement
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

const MOVE_UP = "up";
const MOVE_DOWN = "down";
const MOVE_RIGHT = "right";
const MOVE_LEFT = "left";

let game = {
	gridSize: 20,
	refreshRate: 500, // milliseconds
};

class Player {
	/**
	 * @param {number} x
	 * @param {number} y
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {game} game
	 */
	constructor(x, y, ctx, game) {
		this.x = x;
		this.y = y;
		this.game = game;
		this.ctx = ctx;
		this.currentDirection = "MOVE_DOWN";
		this.head = new Segment(this.x, this.y, "yellow", ctx);
		this.segments = [];

		this.lastUpdate = 0;
		this.wireUpEvents();

		switch (this.currentDirection) {
			case "MOVE_DOWN":
				this.head.y += this.game.gridSize;
			case "MOVE_UP":
				this.head.y -= this.game.gridSize;
			case "MOVE_RIGHT":
				this.head.y += this.game.gridSize;
			case "MOVE_LEFT":
				this.head.y -= this.game.gridSize;
				break;
		}
	}

	/**
	 * @param {number} elaspedTime
	 */
	update(elaspedTime) {
		this.lastUpdate += elaspedTime;
		if (this.lastUpdate < this.game.refreshRate)
			switch (this.currentDirection) {
				case "MOVE_DOWN":
					this.head.y += this.game.gridSize;
				case "MOVE_UP":
					this.head.y -= this.game.gridSize;
				case "MOVE_RIGHT":
					this.head.y += this.game.gridSize;
				case "MOVE_LEFT":
					this.head.y -= this.game.gridSize;
			}
	}

	draw() {
		this.head.draw();
		this.segments.forEach((s) => {});
	}
	wireUpEvents() {
		document.addEventListener("keydown", (e) => {
			console.log(e.code);
			switch (e.code) {
				case "ArrowUp":
					this.currentDirection = "MOVE_UP";
					break;
				case "ArrowDown":
					this.currentDirection = "MOVE_DOWN";
					break;
				case "ArrowRight":
					this.currentDirection = "MOVE_RIGHT";
					break;
				case "ArrowLeft":
					this.currentDirection = "MOVE_LEFT";
					break;
			}
		});
	}

	grow(growBy) {
		for (let i = 0; i < growBy; i++) {
			this.segments.push(new Segment(this.x, this.y, "purple", this.ctx));
		}
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

	/**
	 * @param {number} elaspedTime
	 */
	update(elaspedTime) {}

	draw() {
		this.ctx.fillStyle = this.color;
		this.ctx.fillRect(this.x, this.y, this.w, this.h);
	}
}

// Food notes:
// Should obey our gird restrctions
//When you run into it ur snake grows  - randomize these
// 	Red food + 1 segment/ Blue food + 2 segments/ Gold food + 4 segments
// Start with circles
// spaw in random grid
// 	within the bounderies
// 	only spwan on empty grid spots
// How many food spawn?
//	make it configurable
// 	at least 2 per player

class Food {
	/**
	 * @param {CanvasRenderingContext2D} ctx
	 */
	constructor(ctx) {
		this.ctx = ctx;
		this.x = 0;
		this.y = 0;
		this.radius = game.gridSize / 2;
		this.color = "red";
		this.growBy = 1;
		this.isEaten = true;
	}

	spawn() {
		this.isEaten = false;

		let foodType = Math.floor(Math.random() * 3 + 1);

		switch (foodType) {
			case 1:
				this.color = "red";
				this.growBy = 1;
			case 2:
				this.color = "blue";
				this.growBy = 2;
			case 3:
				this.color = "gold";
				this.growBy = 4;
				break;
		}

		let xGridMaxValue = canvas.width / game.gridSize;
		let yGridMaxValue = canvas.height / game.gridSize;

		let randomX = Math.floor(Math.random() * xGridMaxValue);
		let randomY = Math.floor(Math.random() * yGridMaxValue);

		this.x = randomX * game.gridSize;
		this.y = randomY * game.gridSize;
	}

	update() {}

	draw() {
		if (this.isEaten) return;

		this.ctx.beginPath();
		this.ctx.fillStyle = this.color;
		this.ctx.arc(
			this.x + this.radius,
			this.y + this.radius,
			this.radius,
			0,
			Math.PI * 2
		);
		this.ctx.fill();
		this.ctx.closePath();
	}
}

// Other things we can run into:
// Bomb
// makes you faster

let p1 = new Player(5 * game.gridSize, 5 * game.gridSize, ctx, game);

let food = [new Food(ctx), new Food(ctx), new Food(ctx), new Food(ctx)];

/**
 * @param {Array<Player>} players
 * @param {Array<Food>} food
 */
function checkIfFoodIsConsumed(players, food) {
	food.forEach((f) => {
		players.forEach((p) => {
			if (p.x == f.x && p.y == f.y) {
				// food is eaten
				f.isEaten = true;
			}
		});
	});
}

let currentTime = 0;

/**
 * @param {number} timestamp
 */
function gameLoop(timestamp) {
	let elaspedTime = timestamp - currentTime;
	currentTime = timestamp;

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	p1.update(elaspedTime);
	p1.draw();

	food.forEach((f) => {
		f.draw();
	});

	food.filter((f) => f.isEaten).forEach((f) => {
		f.spawn();
	});

	requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
