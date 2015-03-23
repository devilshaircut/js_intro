
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
        var tileCoordinate = "row" + i + "col" + j;
        $(rowIdentifier).append("<li class='" + tileCoordinate + "' onclick='game.methods.flipTile(\"" + tileCoordinate + "\")'><span>" + copiedGrid[0] + "</span></li>");
        copiedGrid.splice(0, 1);
      }
    }
  };

  drawGrid(numberOfRows, generatedGrid);


  








});


var game = {
  methods: {
    flipTile: function(tileToFlip) {
      if (game.totalMatches === null) {
        game.totalMatches = ($("ol#tiles li ol").length * $("ol#tiles li ol").length) / 2;
      }
      if (game.totalMatches === 0) {
        console.log("Refresh the page to start a new game.");
      }
      if (game.turn[0] === null) {
        game.turn[0] = tileToFlip;
        $("." + tileToFlip).toggleClass("flipped");
      }
      else if (game.turn[1] === null) {
        game.turn[1] = tileToFlip;
        if ( game.turn[0] !== game.turn[1] ) {
          $("." + tileToFlip).toggleClass("flipped");
          setTimeout(game.methods.finishTurn, 500);
        }
        else {
          game.turn[1] = null;
        }
      }
    },
    finishTurn: function() {
      if ( $("." + game.turn[0] + " span").text() === $("." + game.turn[1] + " span").text() ) {
        console.log("A match was found!");
        game.turn = [null, null];
        game.totalMatches--;
        console.log(game.totalMatches);
        if (game.totalMatches === 0) {
          window.alert("You win!");
        }
      }
      else {
        $("." + game.turn[0]).toggleClass("flipped");
        $("." + game.turn[1]).toggleClass("flipped");
        game.turn = [null, null];
      }
    }
  },
  turn: [null, null],
  totalMatches: null
};












