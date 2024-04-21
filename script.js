// 1) gameboard object
// Create a module for the gameboard so it can't be reused to make additional instances
// Stores: array of values
// Gameboard - an array of 9 empty values inside of an object (where the key:value pair is space:token)
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
            board[i].push(cell);
        }
    }

    const getBoard = () => board;

    // Function for player to mark something on the gameboard
    // Like put mark in certain position within the array
    
    // Do we actually need cell here?
    const placeMark = (cell, player) => {
        const availableCells = board.filter((row) => row[column].getValue() === 0).map(row => row[column]);

        // If no cells make it through the filter, 
        // the move is invalid. Stop execution.
        if (!availableCells.length) return;

        // Otherwise, I have a valid cell, the last one in the filtered array
        const boardIndex = prompt('where will you place your mark?')
        
        board[boardIndex][cell].addToken(player);
    };

    // Make a printBoard function to print the gameboard to the console
    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
        console.log(boardWithCellValues);
    };

    return { getBoard, placeMark, printBoard };

    // Factory function remember, so return the functions (closure)
})();

const cell = (function () {
    let value = 0;

    // Accept a player's mark to change the value of the cell
    const addMark = (player) => {
        value = player;
    };

    // How we will retrieve the current value of this cell through closure
    const getValue = () => value;

    return { addMark, getValue };
})();

// 2) player object
function createPlayer(name) {
    let token;
    let score = 0;

    const getScore = () => score;
    const increaseScore = () => score++;
    return { name, token, score, getScore, increaseScore }
};

// 3) game object
const game = (function () {
    // Stores: matches won so far, boolean: game over, winner (computer or bot), round number
    let round;
    const board = gameboard();
    const playerName = prompt('please enter your name');
    const botName = prompt('please enter your opponent\'s name');
    // Create one human player, that the player controls
    const human = createPlayer(playerName);
    human.token = 'X';
    // Create one computer player
    const bot = createPlayer(botName)
    bot.token = '0';

    const players = [human, bot]
    console.log({ human, bot });

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    const playRound = (column) => {
        // Drop a token for the current player
        console.log(
            `Dropping ${getActivePlayer().name}'s token into column ${column}...`
        );
        board.dropToken(column, getActivePlayer().token);

        /*  This is where we would check for a winner and handle that logic,
            such as a win message. */

        // Switch player turn
        switchPlayerTurn();
        printNewRound();
    }
    printNewRound();

    return { playRound, getActivePlayer };

})();


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