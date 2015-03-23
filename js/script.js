// This function initializes the game grid, with dimensions defined in the HTML/DOM.
$(document).ready(function() {

  // Store the number of rows.
  // We assume that the grid will always be a square, so we don't need to know the number of columns.
  var numberOfRows = $("ol#tiles li ol").length;

  // This is a function that generates the game grid.
  // The grid will be represented as a single serialized array of tile values.
  // Tile values will each be repeated 1 time, to represent each individual in a pair.
  var generateGrid = function(gridSize) {
    // Check to make sure the grid has an even number of tiles.
    // Since each tile has 1 pair, this is mandatory.
    if (gridSize%2 !== 0) {
      window.alert("Grid must have an even number of tiles!");
    }
    // If the grid has an even number of tiles, make the grid.
    else {
      // Calculate the total number of tiles.
      var totalTiles = gridSize * gridSize;
      // Calculate the maximum value on any given tile.
      var maxTileValue = totalTiles / 2;
      // This function creates a basic, ordered grid.
      var createGrid = function(highestTileValue) {
        var emptyGrid = [];                             // Initialize the basic, ordered grid.
        for(var i = 0; i < highestTileValue; i++) {
          emptyGrid.push(i);                            // Begin populating the basic, ordered grid with number values.
          emptyGrid.push(i);                            // Do this twice, so that each tile has a paired tile.
        }
        return emptyGrid;
      };
      // This function takes a basic, ordered grid, and randomizes it.
      var randomizeGrid = function(grid) {
        var newGrid = [];                               // Initialize the new grid.
        for(var j = 0; j < grid.length;) {
          var chosenIndex = Math.floor(Math.random() * grid.length);    // Randomly choose an element from the unordered grid.
          newGrid.push(grid[chosenIndex]);              // Add this element to the new grid.
          grid.splice(chosenIndex, 1);                  // Remove this element from the old grid.
        }
        return newGrid;
      };
      // Run the grid construction functions and return the grid.
      var orderedGrid = createGrid(maxTileValue);       // Create the ordered grid.
      var finalGrid = randomizeGrid(orderedGrid);       // Take the ordered grid and scramble it.
      return finalGrid;
    }
  };

  // Create the grid.
  var generatedGrid = generateGrid(numberOfRows);

  // We need to take a grid and draw it into the HTML/DOM.
  var drawGrid = function(gridSize, grid) {
    // Iterate through the rows.
    // Continue until the provided base grid is empty.
    for(var i = 1; i <= gridSize; i++) {
      var rowIdentifier = "ol#row" + i;
      // Iterate through the columns in each row.
      // Each of these is a tile.
      for(var j = 1; j <= gridSize; j++) {
        // Create a unique ID for the tile.
        var tileCoordinate = "row" + i + "col" + j;
        // Create the tile by appending the tile's HTML to its parent row.
        // Also assign its unique ID and onclick event (thus tying it to the game control logic).
        $(rowIdentifier).append("<li class='" + tileCoordinate + "' onclick='game.methods.flipTile(\"" + tileCoordinate + "\")'><span>" + grid[0] + "</span></li>");
        // Remove the appended tile from the base grid.
        grid.splice(0, 1);
      }
    }
  };

  // Draw the grid into the HTML/DOM.
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
        game.totalMatches = ($("ol#tiles li ol").length * $("ol#tiles li ol").length) / 2;    // Use jQuery to determine the number of rows. The grid is always a square, so the number of rows squared, divided by 2 represents the number of pairs.
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
        game.turn[0] = tileToFlip;                      // Set the first tile.
        $("." + tileToFlip).toggleClass("flipped");     // Flip the first tile.
      }
      // Check to see if this is the second tile selection in the turn.
      // If it is, flip the tile over - then finish the turn.
      // Finishing the turn will either leave both tiles up (if the tiles match),
      // or it will revert both tiles to their original state (if the tiles don't match).
      else if (game.turn[1] === null) {
        game.turn[1] = tileToFlip;                      // Set the second tile.
        $("." + tileToFlip).toggleClass("flipped");     // Flip the second tile.
        setTimeout(game.methods.finishTurn, 500);       // In 0.5 seconds, resolve the turn.
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
        game.turn = [null, null];                       // Reset the turn array to its zero'ed out state.
        game.totalMatches--;                            // Decrement the game counter.
        if (game.totalMatches === 0) {                  // If the game counter is 0, the game is over.
          window.alert("You win!");
        }
      }
      // The tiles didn't match.
      // Reset the turn and revert the tiles to their original state.
      else {
        $("." + game.turn[0]).toggleClass("flipped");   // Flip the cards back to their hidden state.
        $("." + game.turn[1]).toggleClass("flipped");   // Flip the cards back to their hidden state.
        game.turn = [null, null];                       // Reset the turn array to its zero'ed out state.
      }
    }
  }
};












