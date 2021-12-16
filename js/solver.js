//author: dzy3
function Solver(grid) {
  this.grid = grid;
  this.type = "minimax";
  this.heuristic = "score";
  this.depth = 7;
}

Solver.prototype.solverMove = function() {
  var move = -1;
  switch(this.type){
    case 'random' :
      return Math.floor(Math.random() * 4);
    
    case 'daniel':
      return this.humanMove();

    case 'minimax':
      move = this.minimaxMove().move;
      break;

    case 'expectimax':
      move = this.expectimaxMove().move;
      break;
  }
  if (move == -1) {
    move = this.humanMove();
  }
  return move;
};


Solver.prototype.humanMove = function() {
  if (this.grid.copy().move(3).moved) {
    return 3
  } else if (this.grid.copy().move(2).moved) {
    return 2
  } else if (this.grid.copy().move(1).moved) {
    return 1
  } else {
    return 0
  }
};

Solver.prototype.evaluation = function(grid) {
  switch(this.heuristic){
    case 'score' :
      return this.scoreEvaluation(grid);
    case 'highest' :
      return this.highEvaluation(grid);
    case 'empty' :
        return this.emptyEvaluation(grid);
    case 'complexV1' :
      return this.complexV1Evaluation(grid);
    case 'complexV2' :
      return this.complexV2Evaluation(grid);
    case 'complexV3':
      return this.complexV3Evaluation(grid);
  }
}

Solver.prototype.highEvaluation = function(grid) {
  return grid.kthLargestTile(0);
}

Solver.prototype.emptyEvaluation = function(grid) {
  return grid.availableCells().length;
}


Solver.prototype.scoreEvaluation = function(grid) {
  return grid.score;
};

Solver.prototype.complexV1Evaluation = function(grid) {
  var num_empty = this.emptyEvaluation(grid);
  var score = this.scoreEvaluation(grid);
  var largest = grid.kthLargestTile(0);
  return score * num_empty * largest; 
}

Solver.prototype.smoothness = function(grid) {
  var smoothnessScore = 0;
  var borderX = grid.size - 1;
  var borderY = grid.size - 1;
  for (let x = 0; x < borderX; x++) {
    for (let y = 0; y < borderY; y++) {
      if (grid.cells[x][y] && grid.cells[x][y + 1]) {
        smoothnessScore += Math.abs(grid.cells[x][y].value - grid.cells[x][y+1].value);
      }

      if (grid.cells[x][y] && grid.cells[x+1][y]) {
        smoothnessScore += Math.abs(grid.cells[x][y].value - grid.cells[x+1][y].value);
      }
    }
  }
  return smoothnessScore;
};

Solver.prototype.complexV2Evaluation = function(grid) {
  var num_empty = this.emptyEvaluation(grid);
  var score = this.scoreEvaluation(grid);
  var largest = grid.kthLargestTile(0);
  var smoothness = this.smoothness(grid);
  var weights = {empty: 20, score: 1, largest: 4, smooth: -.1};

  return weights.score * score + weights.empty * num_empty + weights.largest * largest + weights.smooth * smoothness
}

Solver.prototype.complexV3Evaluation = function(grid) {
  var score = 0;
  var largest = grid.kthLargestTile(0);
  var num_empty = grid.availableCells().length;
  var smoothness = this.smoothness(grid);

  var weights = {empty: 20, smooth: -.08, middle: -.1, corner: 100};
  
  score += weights.empty * num_empty;
  score += weights.smooth * smoothness;

  var largestInCorner = false;

  grid.eachCell(function(x, y, cell) {
    if (cell) {
      if (x > 0 && x < grid.size - 1 && y > 0 && y < grid.size - 1) {
        score += weights.middle * cell.value;
      }
      
      if (cell.value == largest && !largestInCorner) {
        var onBorderX = (x == 0 || x == grid.size-1);
        var onBorderY = (y == 0 || y == grid.size-1);
        if (onBorderX && onBorderY) {
          largestInCorner = true;
        }
      }

    }
  });

  if (largestInCorner) {
    score += weights.corner;
  }
  
  return score;
};

Solver.prototype.minimaxMove = function() {
  var maxMove = {move: -1, score: -1};
  var mindepth = Math.floor(this.depth/2);
  for (var d = mindepth; d <= this.depth; d++) {
    var temp = this.maximize(this.grid, d, -(2**30), 2**30, this.heuristic);
    if (temp.score > maxMove.score) {
      maxMove = temp;
    }
  }
  return maxMove;

};


Solver.prototype.maximize = function(grid, depth, a, b, heuristic){
  if (depth == 0) {
    return {move: -1, score: this.evaluation(grid)};
  }
  var maxMove = {move: -1, score: -(2**30)};
  for (let dir = 0; dir < 4; dir++) {
    var temp = grid.copy();
    var response = temp.move(dir);
    if (!response.moved) {
      continue;
    }

    var result = this.minimize(temp, depth - 1, a, b, heuristic);
    if (result.score > a) { 
      a = result.score;
      maxMove.move = dir;
      maxMove.score = a;
    }
    if (b <= a){
      break;
    }
  }
  return maxMove;
};

Solver.prototype.minimize = function(grid, depth, a, b, heuristic){
  if (depth == 0) {
    return {move: -1, score: this.evaluation(grid)};
  }

  var minMove = {move: -1, score: (2**30)};
  var availableCells = grid.availableCells();

  for (let cell of availableCells) {
    var x = cell.x;
    var y = cell.y;
    var twoGrid = grid.copy();
    twoGrid.insertTile(new Tile({x, y}, 2));
    var result = this.maximize(twoGrid, depth - 1, a, b, heuristic);
    b = Math.min(b, result.score);
    if (b <= a) {
      break;
    }

    var fourGrid = grid.copy();
    fourGrid.insertTile(new Tile({x, y}, 4));
    result = this.maximize(fourGrid, depth - 1, a, b, heuristic);
    b = Math.min(b, result.score);
    if (b <= a) {
      break;
    }
  }
  minMove.score = b;
  return minMove;
};

Solver.prototype.expectimaxMove = function() {
  console.log('expectimax');
  var memo = {};
  return this.expectimax(this.grid, this.depth, memo);
}

Solver.prototype.expectimax = function(grid, depth, memo) {
  if (depth == 0) {
    return {move: -1, score: this.evaluation(grid)};
  }

  var expectMove = {move: -1, score: -(2**30)};

  for (let dir = 0; dir < 4; dir++) {
    var temp = grid.copy();
    var response = temp.move(dir);
    if (!response.moved) {
      continue;
    }
    var availableCells = temp.availableCells();
    var numCells = availableCells.length;
    var expectedScore = 0;
    for (let cell of availableCells) {
      var x = cell.x;
      var y = cell.y;
      var twoGrid = temp.copy();
      
      twoGrid.insertTile(new Tile({x, y}, 2));
      var result = this.expectimax(twoGrid, depth - 1, memo);
      expectedScore += 1/numCells * .9 * result.score;

      var fourGrid = temp.copy();
      fourGrid.insertTile(new Tile({x, y}, 4));
      result = this.expectimax(fourGrid, depth - 1, memo);
      expectedScore += 1/numCells * .1 * result.score;
    }
    if (expectedScore > expectMove.score) {
      expectMove = {move: dir, score: expectedScore};
    }
  }
  return expectMove;
  

}