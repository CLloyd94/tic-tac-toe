// 1) gameboard object
// Create a module for the gameboard so it can't be reused to make additional instances
// Stores: array of values, boolean: gameboard full?
// Gameboard - an array of 9 empty values inside of an object (for some reason)
// 0 1 2
// x x x
// 3 4 5 
// x x x
// 6 7 8 
// x x x
const gameboard = (function () {
    // Create variable for number of rows
    const rows = 3;
    // Create variable for number of columns
    const columns = 3;
    const board = [];
    // Use nested for loop with these numbers to create the gameboard
    for (let i = 0; i < rows; i++) {
        board[i] = ['row'];
        for (let j = 0; j < columns; j++) {
            board[i].push(['column']);
        }
    }
    // Make a printBoard function to print the gameboard to the console

    return { board };

    // Factory function remember, so return the functions (closure)
})();

// 2) player object
function createPlayer(name) {
    let token;
    let score = 0;

    const getScore = () => score;
    const increaseScore = () => score++;
    return { name, token, score, getScore, increaseScore }
};
// Stores: name, boolean: is it their turn?, score, boolean: won(? maybe) 
// Create one human player, that the player controls
const playerName = prompt('please enter your name');
const botName = prompt('please enter your opponent\'s name');

const human = createPlayer(playerName);
human.token = 'X';
const bot = createPlayer(botName)
bot.token = '0';

console.log({human, bot});
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