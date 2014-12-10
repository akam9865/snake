(function () {
	if (typeof SG === "undefined") {
		window.SG = {};
	}
	
	var View = SG.View = function ($boardEl, $scoreEl) {
		this.$boardEl = $boardEl;
		this.$scoreEl = $scoreEl;
		this.board = new SG.Board(20);
		this.snake = new SG.Snake(this.board);
		this.speed = 0;
		this.highScores = {
			"slow": [],
			"medium": [],
			"fast": []
		};
		
		$("button").on("click", this.start.bind(this))
		$(window).on("keydown", this.handleKeyEvent.bind(this));
	};
	
	View.prototype.start = function (event) {
		var view = this;

		this.$boardEl.empty();
		this.speed = event.currentTarget.dataset.speed;
		var speed = this.speed
		this.$boardEl.append($("<div class='timer'></div>"));

		setTimeout(function() {$(".timer").text(3)}, 0);
		setTimeout(function() {$(".timer").text(2)}, 1000);
		setTimeout(function() {$(".timer").text(1)}, 2000);
		setTimeout(function() {
				$(".setup").addClass("inactive");
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
		
			// var inits = prompt("You scored" + this.snake.score + " enter your initials");
			window.clearInterval(this.interval);
			
			this.highScores[View.SPEEDS[this.speed]].push(this.snake.score);
			this.handleHighScores();
			$(".setup").removeClass("inactive");
			
			this.board = new SG.Board(20);
			this.snake = new SG.Snake(this.board);
		};
	};
	
	View.SPEEDS = {
		150: "slow",
		100: "medium",
		50: "fast"
	}
	
	View.KEYS = {
		37: "W",
		38: "N",
		39: "E",
		40: "S"
	}
	
	function numSort(a, b) {
		return b - a;
	};
	
	View.prototype.handleHighScores = function () {
		
		$.each(this.highScores, function(idx, value) {
			var tops = value.sort(numSort).slice(0, 3);
			var $ol = $("#" + idx);
			$ol.empty();
			
			tops.forEach(function (score){
				var $li = $("<li></li>");
				$li.text(score);
				$ol.append($li);
			});
		});
	};
	
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