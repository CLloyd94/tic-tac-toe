// 1) gameboard object/module
const gameboard = (function () {
    // Create variable for number of rows
    const rows = 3;
    // Create variable for number of columns
    const columns = 3;
    const board = [];
    // Use nested for loop with these numbers to create the gameboard
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    // Function for player to mark something on the gameboard
    // Like put mark in certain position within the array
    
    const placeMark = (row, column, player) => {
        if (row < 0 || row >= rows || column < 0 || column >= columns) {
            console.log("Invalid cell coordinates.");
            return false;
        }
        if (board[row][column].getValue() === 0) {
            board[row][column].addMark(player);
            return true;
        } else {
            console.log("Cell is already occupied.");
            return false;
        }
    };

    // Make a printBoard function to print the gameboard to the console
    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((column) => column.getValue()))
        console.log(boardWithCellValues);
    };

    return { getBoard, placeMark, printBoard };

    // Factory function remember, so return the functions (closure)
})();

// Cell factory function
function Cell () {
    let value = 0;

    // Accept a player's mark to change the value of the cell
    const addMark = (player) => {
        value = player;
    };

    // Get the current value of the cell
    const getValue = () => value;

    return { addMark, getValue };
};

// 2) player factory function
function createPlayer(name) {
    let mark;
    let score = 0;

    const getScore = () => score;
    const increaseScore = () => score++;
    return { name, mark, score, getScore, increaseScore }
};

// 3) game object/module
const gameController = (function () {
    // Stores: matches won so far, boolean: game over, winner (computer or bot), round number
    // Include logic for number of rounds - loop through until number of rounds complete
    // let round;
    const playerName = prompt('please enter your name');
    const botName = prompt('please enter your opponent\'s name');
    // Create one human player, that the player controls
    const human = createPlayer(playerName);
    human.mark = 'X';
    // Create one computer player
    const bot = createPlayer(botName)
    bot.mark = 'O';

    console.log({ human, bot });

    let activePlayer = bot;

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === human ? bot : human;
    };
    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        gameboard.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    function isBoardFull(board) {
        // Check every cell on the board to see if any are still empty (value 0)
        return board.every(row => row.every(cell => cell.getValue() !== 0));
    }

    function checkWinner(board) {
        // Check rows, columns and diagonals       
        const rows = 3;
        const columns = 3;

        for (let i = 0; i < rows; i++) {
            if (board[i][0].getValue() !== 0 &&
                board[i][0].getValue() === board[i][1].getValue() &&
                board[i][0].getValue() === board[i][2].getValue()) {
                return board[i][0].getValue(); // Winner found
            }
        }

        // Check columns for a winner
        for (let j = 0; j < columns; j++) {
            if (board[0][j].getValue() !== 0 &&
                board[0][j].getValue() === board[1][j].getValue() &&
                board[0][j].getValue() === board[2][j].getValue()) {
                return board[0][j].getValue(); // Winner found
            }
        }

        // Check diagonal (top-left to bottom-right)
        if (board[0][0].getValue() !== 0 &&
            board[0][0].getValue() === board[1][1].getValue() &&
            board[0][0].getValue() === board[2][2].getValue()) {
            return board[0][0].getValue(); // Winner found
        }

        // Check diagonal (top-right to bottom-left)
        if (board[0][2].getValue() !== 0 &&
            board[0][2].getValue() === board[1][1].getValue() &&
            board[0][2].getValue() === board[2][0].getValue()) {
            return board[0][2].getValue(); // Winner found
        }
        return null; // No winner found
    };

    const playRound = () => {
        let gameOver = false;

        do {
            // Do all of our code
            let row, column;
            if (getActivePlayer() === human) {
                row = parseInt(prompt('Enter the row number (0, 1, 2):'), 10);
                column = parseInt(prompt('Enter the column number (0, 1, 2):'), 10);
            } else {
                let success = false;
                while (!success) {
                    row = Math.floor(Math.random() * 3);
                    column = Math.floor(Math.random() * 3);
                    success = gameboard.placeMark(row, column, bot.mark);
                }
            }
            console.log(`Placing ${getActivePlayer().name}'s mark into cell ${[row, column]}...`);
            gameboard.placeMark(row, column, getActivePlayer().mark);
            printNewRound();
            
            // Need some logic to handle player scores after they win a round.
            let winner = checkWinner(gameboard.getBoard());
            if (winner) {
                console.log(`${winner === 1 ? human.name : bot.name} wins!`);
                winner.increaseScore();
                gameOver = true;
            } else if (isBoardFull(gameboard.getBoard())) {
                console.log("It's a tie!");
                gameOver = true;
            } else {
                switchPlayerTurn();
                printNewRound();
            }

        } while (!gameOver);
       
    }
    const startGame = () => {
        printNewRound();
        playRound();
    }
    
    return { playRound, getActivePlayer };

})();

// Display controller module (controls display)
const displayController = (function () {
    // Renders the contents of the gameboard array to the webpage.
    // Get the gameboard array from the factory function (the array)
    const boardDiv = document.querySelector('.gameboard');
    const updateScreen = () => {
        boardDiv.textContent = '';
        // Get the board array
        const board = gameboard.getBoard();
        const activePlayer = gameController.getActivePlayer();
        board.forEach(row => {
            row.forEach((cell, index) => {
                const cellButton = document.createElement('button');
                cellButton.classList.add('cell');
                cellButton.dataset = index; // huh?
                cellButton.textContent = cell.getValue();
                boardDiv.appendChild(cellButton);
            })
        })
    }
    function clickHandlerBoard(e) {
        const selectedCell = e.target.dataset;
        if (!selectedCell) return;
        gameController.playRound(selectedCell);
        updateScreen();
    };

    boardDiv.addEventListener('click', clickHandlerBoard);
    updateScreen();
    // Maybe using an index? Upon clicking a cell...
        // Map that element to the array
    // For each cell

    // Event listeners for cells
    // When each cell is clicked,
    // Map the element clicked to the array?
    // Or register that element clicked as a space in the array
})();

// displayController();





// Event listener for reset button

// Event listener for start game button (within a dialog?)

// Display data inside certain buttons e.g.
// Number of rounds in the round button
// Scores in the score buttons

// Display a winner


// gameController.startGame();

// Functions that allow players to add marks to the board by clicking on a board square