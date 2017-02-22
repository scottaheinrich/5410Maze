let inputStage = {};

var size = 5;

let imgFloor = new Image();
imgFloor.isReady = false;
imgFloor.onload = function() {
	this.isReady = true;
};
imgFloor.src = 'sand.jpg';

function createCharacter(imageSource, location) {
	let image = new Image();
	image.isReady = false;
	image.onload = function() {
		this.isReady = true;
	};
	image.src = imageSource;
	return {
		location: location,
		image: image
	};
}

let maze = [];
initializeMaze();
window.onload = function(){
	document.getElementById('sizeSelector').onclick = function(){
		size = $("input:radio[name=size]:checked").val();
		initializeMaze();
	}
}

function initializeMaze(){
	for (let row = 0; row < size; row++) {
		maze.push([]);
		for (let col = 0; col < size; col++) {
			maze[row].push({
				x: col, y: row, edges: {
					n: null,
					s: null,
					w: null,
					e: null
				}
			});
		}
	}
	maze[0][0].edges.s = maze[1][0];

	maze[0][1].edges.s = maze[1][1];
	maze[0][1].edges.e = maze[0][2];

	maze[0][2].edges.w = maze[0][1];
	maze[0][2].edges.s = maze[1][2];

	maze[1][0].edges.n = maze[0][0];
	maze[1][0].edges.e = maze[1][1];
	maze[1][0].edges.s = maze[2][0];

	maze[1][1].edges.n = maze[0][1];
	maze[1][1].edges.s = maze[2][1];
	maze[1][1].edges.w = maze[1][0];

	maze[1][2].edges.n = maze[0][2];
	maze[1][2].edges.s = maze[2][2];

	maze[2][0].edges.n = maze[1][0];

	maze[2][1].edges.n = maze[1][1];
	maze[2][1].edges.e = maze[2][2];

	maze[2][2].edges.w = maze[2][1];
	maze[2][2].edges.n = maze[1][2];

	maze[3][3].edges.e = maze[3][4];
	maze[3][4].edges.w = maze[3][3];
}






function drawCell(cell) {

	if (imgFloor.isReady) {
		context.drawImage(imgFloor,
		cell.x * (1000 / size), cell.y * (1000 / size),
		1000 / size, 1000 / size);
	}

	if (cell.edges.n === null) {
		context.moveTo(cell.x * (1000 / size), cell.y * (1000 / size));
		context.lineTo((cell.x + 1) * (1000 / size), cell.y * (1000 / size));
		//context.stroke();
	}

	if (cell.edges.s === null) {
		context.moveTo(cell.x * (1000 / size), (cell.y + 1) * (1000 / size));
		context.lineTo((cell.x + 1) * (1000 / size), (cell.y + 1) * (1000 / size));
		//context.stroke();
	}

	if (cell.edges.e === null) {
		context.moveTo((cell.x + 1) * (1000 / size), cell.y * (1000 / size));
		context.lineTo((cell.x + 1) * (1000 / size), (cell.y + 1) * (1000 / size));
		//context.stroke();
	}

	if (cell.edges.w === null) {
		context.moveTo(cell.x * (1000 / size), cell.y * (1000 / size));
		context.lineTo(cell.x * (1000 / size), (cell.y + 1) * (1000 / size));
		//context.stroke();
	}
}

function renderCharacter(character) {
	if (character.image.isReady) {
		context.drawImage(character.image,
			character.location.x * (1000 / size), character.location.y * (1000 / size),
	 		(1000 / size), (1000 / size)
		);
	}
}

function moveCharacter(keyCode, character) {
	if (keyCode === 40) {
		if (character.location.edges.s) {
			character.location = character.location.edges.s;
		}
	}
	if (keyCode == 38) {
		if (character.location.edges.n) {
			character.location = character.location.edges.n;
		}
	}
	if (keyCode == 39) {
		if (character.location.edges.e) {
			character.location = character.location.edges.e;
		}
	}
	if (keyCode == 37) {
		if (character.location.edges.w) {
			character.location = character.location.edges.w;
		}
	}
}

function renderMaze() {
	context.strokeStyle = 'rgb(255, 255, 255)';
	context.lineWidth = 6;

	for (let row = 0; row < size; row++) {
		for (let col = 0; col < size; col++) {
			drawCell(maze[row][col]);
		}
	}
	context.stroke();

}

function render() {
	context.clear();


	renderMaze();
	renderCharacter(myCharacter);
}

function processInput() {
	for (input in inputStage) {
		moveCharacter(inputStage[input], myCharacter);
	}
	inputStage = {};
}

function gameLoop() {
	size = $("input:radio[name=size]:checked").val();


	processInput();
	render();

	requestAnimationFrame(gameLoop);

}

let canvas = null;
let context = null;
var myCharacter = createCharacter('anubis_R.png', maze[0][0]);

function initialize() {
	canvas = document.getElementById('canvas-main');
	context = canvas.getContext('2d');

	CanvasRenderingContext2D.prototype.clear = function() {
		this.save();
		this.setTransform(1, 0, 0, 1, 0, 0);
		this.clearRect(0, 0, canvas.width, canvas.height);
		this.restore();
	};

	window.addEventListener('keydown', function(event) {
		//moveCharacter(event.keyCode, myCharacter);
		inputStage[event.keyCode] = event.keyCode;
	});

	requestAnimationFrame(gameLoop);
}
