$(document).ready(function() {

  var numberOfRows = $("ol#tiles li ol").length;

  var generateGrid = function(gridSize) {
    if (gridSize%2 !== 0) {
      window.alert("Grid must have an even number of tiles!");
    }
    else {
      var totalTiles = gridSize * gridSize;
      var maxTileValue = totalTiles / 2;
      var createGrid = function(highestTileValue) {
        var emptyGrid = [];
        for(var i = 0; i < highestTileValue; i++) {
          emptyGrid.push(i);
          emptyGrid.push(i);
        }
        return emptyGrid;
      };
      var randomizeGrid = function(grid) {
        var newGrid = [];
        for(var j = 0; j < grid.length;) {
          var chosenIndex = Math.floor(Math.random() * grid.length);
          newGrid.push(grid[chosenIndex]);
          grid.splice(chosenIndex, 1);
        }
        return newGrid;
      };
      var orderedGrid = createGrid(maxTileValue);
      var finalGrid = randomizeGrid(orderedGrid);
      return finalGrid;
    }
  };

  var generatedGrid = generateGrid(numberOfRows);

  var drawGrid = function(gridSize, grid) {
    var copiedGrid = grid;
    for(var i = 1; i <= gridSize; i++) {
      for(var j = 1; j <= gridSize; j++) {
        var rowIdentifier = "ol#row" + i;
        $(rowIdentifier).append("<li>" + copiedGrid[0] + "</li>");
        copiedGrid.splice(0, 1);
      }
    }
  };

  drawGrid(numberOfRows, generatedGrid);

});














