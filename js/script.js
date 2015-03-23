
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


// This object contains the matching game's control logic.
var game = {
  // Each turn consists of 2 tile selections.
  // We need to store each of these tile selections for the purposes of comparing them and seeing if they are a match.
  turn: [null, null],
  // A game board has a set number of matching pairs.
  // We need to store this number so that when matching pairs are identified, we can count down to 0 remaining matching pairs.
  // This is the player's win condition.
  totalMatches: null,
  // This is an object for storing game methods.
  methods: {
    // This method is called onclick - when a user clicks a tile.
    flipTile: function(tileToFlip) {
      // If this is the first time the game is run, set the number of tile pairs to find.
      // This number depends on the size of the game board.
      if (game.totalMatches === null) {
        game.totalMatches = ($("ol#tiles li ol").length * $("ol#tiles li ol").length) / 2;
      }
      // Every time a match is found, the counter decrements by 1.
      // If the counter is 0, the game already ended so no gameplay should take place.
      if (game.totalMatches === 0) {
        console.log("Refresh the page to start a new game.");
      }
      // If the tile being clicked is already flipped, do not execute a game interaction.
      // Just tell the player that the tile is already flipped over.
      if ( $("." + tileToFlip).hasClass("flipped") ) {
        console.log("This tile is already flipped over! Select another tile.");
      }
      // Check to see if this is the first tile selection in the turn.
      // If it is, flip the tile over.
      else if (game.turn[0] === null) {
        game.turn[0] = tileToFlip;
        $("." + tileToFlip).toggleClass("flipped");
      }
      // Check to see if this is the second tile selection in the turn.
      // If it is, flip the tile over - then finish the turn.
      // Finishing the turn will either leave both tiles up (if the tiles match),
      // or it will revert both tiles to their original state (if the tiles don't match).
      else if (game.turn[1] === null) {
        game.turn[1] = tileToFlip;
        $("." + tileToFlip).toggleClass("flipped");
        setTimeout(game.methods.finishTurn, 500);
      }
    },
    // This method is called when two tiles have been flipped,
    // It decides what action to take based on the two flipped tiles.
    finishTurn: function() {
      // Check to see if the tiles match.
      // If they do, reset the turn and note that a match was found.
      // Also check to see if it was the last match that was found.
      // If it is the last match that was found, inform the player that they won.
      if ( $("." + game.turn[0] + " span").text() === $("." + game.turn[1] + " span").text() ) {
        game.turn = [null, null];
        game.totalMatches--;
        if (game.totalMatches === 0) {
          window.alert("You win!");
        }
      }
      // The tiles didn't match.
      // Reset the turn and revert the tiles to their original state.
      else {
        $("." + game.turn[0]).toggleClass("flipped");
        $("." + game.turn[1]).toggleClass("flipped");
        game.turn = [null, null];
      }
    }
  }
};












