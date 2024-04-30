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
            console.log("Invalid cell coordinates.");
            return false;
        }
        // If the selected cell is empty, add the player's mark
        else if (board[row][column].getValue() === 0) {
            board[row][column].addMark(player);
            console.log("Successful move.");
            return true;
        // If the selected cell is not empty
        } else {
            console.log("Cell is already occupied."); // This needs to be fixed.
            return false;
        }
    };

    // clearBoard function to clear all values from all cells
    const clearBoard = () => {
        board.length = 0;
        for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let j = 0; j < columns; j++) {
                board[i].push(Cell());
            }
        }
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

    return { addMark, getValue };
};

// 2) player factory function
function createPlayer(name, mark) {
    let score = 0;

    const getScore = () => score;
    const increaseScore = () => score++;
    return { name, mark, score, getScore, increaseScore }
};

// 3) game object/module
const gameController = (function () {
    const playerName = prompt('please enter your name');
    const botName = prompt('please enter your opponent\'s name');
    // Create one human player
    const human = createPlayer(playerName, 'X');
    // Create one computer player
    const bot = createPlayer(botName, 'O')

    const players = [human, bot];

    // Getter for human player
    const getHuman = () => human;

    // Getter for bot player
    const getBot = () => bot;

    let activePlayer = human;

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === human ? bot : human;
    };
    const getActivePlayer = () => activePlayer;

    const startNewGame = () => {
        gameboard.clearBoard();
        playRound();
        // console.log(`${getActivePlayer().name}'s turn.`);
    };

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

    // Include logic for number of rounds - loop through until number of rounds complete
    // let round;
    const playRound = (row, column) => {

        if (activePlayer === bot) {
            let row = Math.floor(Math.random() * 3);
            let column = Math.floor(Math.random() * 3);
            gameboard.placeMark(row, column, getActivePlayer().mark);
            switchPlayerTurn();
        }

        if (gameboard.placeMark(row, column, getActivePlayer().mark)) {
            // Need some logic to handle player scores after they win a round.
            let winner = checkWinner(gameboard.getBoard());
            if (winner) {
                console.log(`${winner === 'X' ? human.name : bot.name} wins!`);
                (winner === 'X' ? human : bot).increaseScore();
                console.log('Starting new game');
                startNewGame();
            } else if (isBoardFull(gameboard.getBoard())) {
                console.log("It's a tie!");
                startNewGame();
            } else {
                switchPlayerTurn(); // not doing so correctly.
                console.log(`It is now ${getActivePlayer().name}'s turn`);
            }     
        }
}

    return { playRound, getHuman, getBot, getActivePlayer, startNewGame, players };

})();

// Display controller module (controls display)
const displayController = (function () {
    // Renders the contents of the gameboard array to the webpage.
    // Get the gameboard array from the factory function (the array)
    // Query selectors
    const boardDiv = document.querySelector('.gameboard');
    const playerScore = document.querySelector('.player-score-button');
    const botScore = document.querySelector('.bot-score-button');
    const roundsButton = document.querySelector('.rounds-button');
    const resetButton = document.querySelector('.reset-button');
    // Other variables
    // Get board array
    const board = gameboard.getBoard();
    const activePlayer = gameController.getActivePlayer();
    const human = gameController.getHuman();
    const bot = gameController.getBot();
    // Display scores at the top
    playerScore.textContent = `${human.name}'s score: ${human.score}`;
    botScore.textContent = `${bot.name}'s score: ${bot.score}`;

    const updateScreen = () => {
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
                cellButton.style.color = (activePlayer === human) ? '#F9DC5C' : '#F4FFFD';
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
        // const selectedCell = row[column];
        // if (!selectedCell) return;
        gameController.playRound(row, column)
            updateScreen();
        
        // if (!selectedCell) return;
        // gameController.playRound(selectedCell);
        // updateScreen();
    };

    // Event listener for reset button

    // Event listener for start game button (within a dialog?)

    // Display number of rounds in the round button

    // Display a winner





    boardDiv.addEventListener('click', cellClickHandler);

    // Initial render
    updateScreen();
})();