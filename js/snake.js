(function () {
	if (typeof SG === "undefined") {
		window.SG = {};
	}
	
	var Coord = SG.Coord = function (x, y) {
		this.x = x;
		this.y = y;
	};
	
	Coord.prototype.plus = function (coord2) {
		return new Coord(this.x + coord2.x, this.y + coord2.y);
	};
	
	Coord.prototype.equals = function (otherCoord) {
		return (this.x === otherCoord.x && this.y === otherCoord.y)
	};
	
	Coord.prototype.randomCoord = function () {
		x = Math.floor(Math.random() * 20)
		y = Math.floor(Math.random() * 20)

		return new Coord(x, y)
	};
	
	var Snake = SG.Snake = function (board) {
		this.dir = "N";
		this.board = board;
		var center = new Coord(board.dim / 2, board.dim / 2);
		this.segments = [center];
		this.score = 0;
		
		this.apple = [this.randomApple()]
	};
	
	Snake.DIFFS = {
		"N": new Coord(-1, 0),
		"S": new Coord(1, 0),
		"E": new Coord(0, 1),
		"W": new Coord(0, -1)
	};
	
	function oppositeDir(dir) {
		switch (dir) {
		case "N":
			return "S";
			break;
		case "S":
			return "N";
			break;
		case "W":
			return "E";
			break;
		case "E":
			return "W";
			break;
		}
	};
	
	Snake.prototype.head = function () {
		return this.segments[this.segments.length - 1];
	};
	
	Snake.prototype.randomApple = function randomApple() {
		var app = (new Coord(0,0)).randomCoord()
		
		return app;
	};
	
	Snake.prototype.isValid = function () {
		var x = this.head().x;
		var y = this.head().y;
		
		if (x < 0 || y < 0 || x > 19 || y > 19) {
			return false
		};
		
		for (i = 0; i < this.segments.length - 1; i++) {
			if (this.segments[i].equals(this.head())) {
				return false
			}
		};
		
		return true;
	};
	
	
	Snake.prototype.move = function () {

		if (this.head().equals(this.apple[0])) {
			this.segments.push(this.head().plus(Snake.DIFFS[this.dir]));
			this.apple = [this.randomApple()];
			this.score += 10;
		} else {
			this.segments.push(this.head().plus(Snake.DIFFS[this.dir]));
			this.segments.shift();
		}


		if (!this.isValid()) {
			this.segments = [];
		}
	};
	
	Snake.prototype.turn = function (newDir) {
		if (this.segments.length === 1 || newDir !== oppositeDir(this.dir)) {
			this.dir = newDir;
		}
	};
	
	var Board = SG.Board = function (dim) {
		this.dim   = dim;
		this.snake = new Snake(this);

		// this.render();
	};
	
	Board.prototype.makeGrid = function (dim) {
		var grid = [];
		
		for (i = 0; i < dim; i++) {
			var row = [];
			for(j = 0; j < dim; j++) {
				row.push(".");
			}
			grid.push(row);
		}
		return grid;
	};
	
	Board.prototype.render = function () {
		var grid = this.makeGrid(this.dim);
		
		this.snake.segments.forEach( function (segment) {
			grid[segment.x][segment.y] = "S";
		});
		

    var g = grid.map(function (row) {
      return row.join("");
    }).join("\n");
		
		console.log(g)
	};
})();