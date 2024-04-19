// 1) gameboard object
// Stores: array of values, boolean: gameboard full?
// Gameboard - an array of 9 empty values inside of an object (for some reason)
// 0 1 2
// x x x
// 3 4 5 
// x x x
// 6 7 8 
// x x x

// Create variable for number of rows
// Create variable for number of columns
// Use nested for loop with these numbers to create the gameboard

// Make a printBoard function to print the gameboard to the console

// Factory function remember, so return the functions (closure)

// Create a module for the gameboard so it can't be reused to make additional instances


// 2) player object
// Stores: name, boolean: is it their turn?, score, boolean: won(? maybe) 
// Create one human player, that the player controls
// Create one computer player, which should work out where to go. Easy difficulty: random placement, 

// 3) game object
// Stores: matches won so far, boolean: game over, winner (computer or bot), round number

// Player inputs their placement choice
// Check if that place isn't already taken
// If it is already taken, do nothing
// If it is not taken, assign choice to the empty element in the array
// Switch players so it's the other player's turn, player:turn set to false

// Game over logic - checking for winning 3-in-a-rows and ties
// If there's a winning combination
// Winning combinations would be as a formula:
// Winning row: n + 1 + 1;
// Winning column: n + 3 + 3;
// Diagonal left to right: n + 4 + 4;
// Diagonal right to left: n + 2 + 2;
// If X matches this pattern, player score ++, next round, start new round
// else if O matches this, computer score ++
// Else if there's a tie, don't increment scores, start new round


// hard difficulty: detect where the player goes and play accordingly

// 4th object that handles the display/DOM logic - renders the contents of the gameboard array to the webpage
// Functions that allow players to add marks to the board by clicking on a board square

// Buttons to start/restart the game
// Function that plays a round
// Display element that shows results at the end of the game.