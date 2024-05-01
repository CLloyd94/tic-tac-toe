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
    
    // Allows other functions to read the board
    const getBoard = () => board;
    // Alows player to mark something on the gameboard via the array
    const placeMark = (row, column, player) => {

        // If the selection is not a cell
        if (row < 0 || row >= rows || column < 0 || column >= columns) {
            console.log(`Invalid cell coordinates, ${player}!`);
            return false;
        }
        // If the selected cell is empty, add the player's mark
        else if (board[row][column].getValue() === 0) {
            board[row][column].addMark(player);
            console.log(`Successful move by ${player} at [${row}, ${column}].`);
            return true;
        // If the selected cell is not empty
        } else {
            console.log(`${player} tried to place mark in [${row}, ${column}]; cell is already occupied.`); // This needs to be fixed.
            return;
        }
    };

    // clearBoard function to clear all values from all cells
    const clearBoard = () => {
        board.forEach(row => {
            row.forEach(cell => cell.clear());
        });
    }
    return { getBoard, placeMark, clearBoard };
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

    const clear = () => {
        value = 0;
    };

    return { addMark, getValue, clear };
};

// 2) player factory function
function createPlayer(mark) {
    let score = 0;

    const getScore = () => score;
    const increaseScore = () => score++;
    return { mark, score, getScore, increaseScore }
};

// 3) game object/module
const gameController = (function () {
    // Create one human player
    const human = createPlayer('X');
    // Create one computer player
    const bot = createPlayer('O')
    // Getter for human player
    const getHuman = () => human;
    // Getter for bot player
    const getBot = () => bot;
    // When game starts, human goes first
    let activePlayer = human;
    // Logic for switching turns to the other player
    const switchPlayerTurn = () => {
        activePlayer = activePlayer === human ? bot : human;
    };
    // Getter for the active player
    const getActivePlayer = () => activePlayer;

    // Checks if every cell in every row is full and returns true if so
    function isBoardFull(board) {
        return board.every(row => row.every(cell => cell.getValue() !== 0));
    }

    function checkWinner(board) {
        // Check rows, columns and diagonals       
        const rows = 3;
        const columns = 3;

        // Check rows for a winner
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

    const updateGameState = () => {
        let winner = checkWinner(gameboard.getBoard());
        if (winner) {
            console.log(`${winner === 'X' ? 'X' : 'O'} wins!`);
            (winner === 'X' ? human : bot).increaseScore();
            console.log('Starting new game');
            gameboard.clearBoard();
            displayController.updateScreen();
        } else if (isBoardFull(gameboard.getBoard())) {
            console.log("It's a tie!");
            gameboard.clearBoard();
            displayController.updateScreen();
        } else {
            switchPlayerTurn(); // not doing so correctly.
            console.log(`It is now ${getActivePlayer().mark}'s turn`);
        }
    };

    const playRound = (row, column) => {
        if (activePlayer === bot) {
            let placed = false;
            let attempts = 0;
            while (!placed && attempts < 50) {
                row = Math.floor(Math.random() * 3);
                column = Math.floor(Math.random() * 3);
                placed = gameboard.placeMark(row, column, bot.mark);
                attempts++;
            }
        } else {
            if (!gameboard.placeMark(row, column, human.mark)) {
                console.log(`${activePlayer} placed mark at [${row}, ${column}]`);
                console.log('Invalid move by human');
                return;
            }
        }
        updateGameState();
    }

    return { playRound, getHuman, getBot, getActivePlayer }; // add startNewGame if necessary

})();

// Renders the contents of the gameboard array to the webpage.
const displayController = (function () {
    // Query selectors
    const boardDiv = document.querySelector('.gameboard');
    const playerScore = document.querySelector('.player-score-button');
    const botScore = document.querySelector('.bot-score-button');
    const resetButton = document.querySelector('.reset-button');
    // Other variables
    const human = gameController.getHuman();
    const bot = gameController.getBot();

    // Clears the screen with a new board
    const updateScreen = () => {
        playerScore.textContent = `X's score: ${human.getScore()}`;
        botScore.textContent = `O's score: ${bot.getScore()}`;
        boardDiv.innerHTML = '';
        // Get the board array
        const board = gameboard.getBoard();
        board.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const cellButton = document.createElement('button');
                cellButton.className = 'cell';
                cellButton.textContent = cell.getValue();
                cellButton.dataset.row = rowIndex; // huh?
                cellButton.dataset.column = colIndex; // huh?
                cellButton.addEventListener('click', cellClickHandler);
                // Setting text based on cell value
                let cellValue = cell.getValue();
                cellButton.textContent = cellValue === 0 ? "" : cellValue;  // Display empty string if value is 0

                // Apply color based on cell mark
                if (cellValue !== 0) {  // Only color if there is a mark
                    cellButton.style.color = (cellValue === 'X') ? '#F9DC5C' : '#F4FFFD';
                }

                boardDiv.appendChild(cellButton);
            });
        });
    }
    function cellClickHandler(e) {
        const row = parseInt(e.target.dataset.row, 10);
        const column = parseInt(e.target.dataset.column, 10);
        gameController.playRound(row, column)
        updateScreen();
    };

    // Event listener for reset button
    resetButton.addEventListener('click', () => {
        console.log(`reset button clicked`)
        gameboard.clearBoard();
        human.score = 0;
        bot.score = 0;
        updateScreen();
    });

    boardDiv.addEventListener('click', cellClickHandler);

    // Initial render
    updateScreen();

    return { updateScreen };
})();