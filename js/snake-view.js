(function () {
	if (typeof SG === "undefined") {
		window.SG = {};
	}
	
	var View = SG.View = function ($boardEl, $scoreEl) {
		this.$boardEl = $boardEl;
		this.$scoreEl = $scoreEl;
		this.board = new SG.Board(20);
		this.snake = new SG.Snake(this.board);
		this.highScores = {};
		
		// this.interval = window.setInterval(this.step.bind(this), 100)
		$("button").on("click", this.start.bind(this))
		// this.$boardEl.on("click", this.start.bind(this))
		
		$(window).on("keydown", this.handleKeyEvent.bind(this));
	};
	
	
	// View.prototype.setupInterval = function () {
	// 	this.interval = window.setInterval(this.step.bind(this), speed)
	// };
	
	View.prototype.start = function (event) {
		var view = this;
		
		this.$boardEl.empty();
		var speed = event.currentTarget.dataset.speed
		
		this.$boardEl.append($("<div class='timer'></div>"))

		setTimeout(function() {$(".timer").text(3)}, 0);
		setTimeout(function() {$(".timer").text(2)}, 1000);
		setTimeout(function() {$(".timer").text(1)}, 2000);
		
		setTimeout(function() {
				view.interval = window.setInterval(view.step.bind(view), speed)
		}, 3000)
	};
	

	View.prototype.render = function () {
		var cellMatrix = setUpCellMatrix(this.board.dim);
		var view = this;
		
		this.snake.segments.forEach( function(segment) {
			cellMatrix[segment.x][segment.y].addClass("snake");
		});
		
		this.snake.apple.forEach( function (apple) {
			cellMatrix[apple.x][apple.y].addClass("apple")
		});
		
		this.$boardEl.empty();
		
		cellMatrix.forEach(function(row){
			var $rowEl = $("<div class='row'></div>");
			row.forEach(function($cell){ $rowEl.append($cell) });
			view.$boardEl.append($rowEl);
		});

		this.$scoreEl.text(this.snake.score);
		
		if (this.snake.segments.length === 0) {
			this.$boardEl.empty();
			alert("YOU LOSE!\nscore: " + this.snake.score)
			window.clearInterval(this.interval);
			
			this.highScores["default"] = this.snake.score;
			
			this.board = new SG.Board(20);
			this.snake = new SG.Snake(this.board);
		};
	};
	
	View.KEYS = {
		37: "W",
		38: "N",
		39: "E",
		40: "S"
	}
	
	View.prototype.handleKeyEvent = function (event) {
		if (View.KEYS[event.keyCode]) {
			this.snake.turn(View.KEYS[event.keyCode]);
		}
	};
	
	View.prototype.step = function () {
		this.snake.move();
		this.render();
	};
	
	function setUpCellMatrix(dim) {
		var cellMatrix = [];
		
		for (i = 0; i < dim; i++) {
			var row = []
			for (j = 0; j < dim; j++) {
				row.push($("<div class='cell'></div>"));
			}
			cellMatrix.push(row);
		}
		return cellMatrix;
	};
})();