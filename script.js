(function (){
    console.log('To start Tic Tac Toe type "nameYourGame = startGame()".');
})();

function startGame(){
    const newGame = gameController();
    console.log('Type "nameYourGame.playRound(row, column)" and replace "row" and "column" with values from 0 to 2. This command will put your token where you want it.')
    return newGame;
}

function gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    const initResBoard = () => { 
        for(let i = 0; i < rows; i++){
            board[i] = [];
            for(let j = 0; j < columns; j++){
                    board[i].push('');
            }
        }
    };
    const getBoard = () => board;
    const printBoard = () => console.log(board);
    const addToken = (row, col, token) => {
        if(board[row][col] != '' || row > 2 || col > 2){
            return false;
        } else{
            board[row][col] = token;
            return true;
        }
    };
    const determineWinner = (token) => {
        const boardFlat = board.flat();
        const winConditions = [
            // horizontal win
            [0,1,2], [3,4,5], [6,7,8],
            // vertical win
            [0,3,6], [1,4,7], [2,5,8],
            // diagonal win
            [0,4,8], [2,4,6]
        ];

        const isWin = winConditions.some(condition => {
            return boardFlat[condition[0]] === token 
            && boardFlat[condition[0]] === boardFlat[condition[1]]
            && boardFlat[condition[0]] === boardFlat[condition[2]];
        })

        const isTie = boardFlat.every(token => token != '');

        return {isWin, isTie};
    };

   return {initResBoard, getBoard, printBoard, addToken, determineWinner};
}

function determinePlayer() {
    let player = Math.floor(Math.random() * 2);

    const getPlayer = () => player;
    const changePlayer = () => {
        player === 0 ? player = 1 : player = 0;
        return player;
    };

    return {getPlayer, changePlayer};
}

function gameController (){
    const board = gameboard();
    const player = determinePlayer();
    let activePlayer = player.getPlayer();
    const players = [
        {
            name: 'playerOne',
            token: 'X',
            score: 0
        },

        {
            name: 'playerTwo',
            token: 'O',
            score: 0
        }
    ];

    // Initialize game with a new board and a random player to start.
    board.initResBoard();
    board.printBoard();
    console.log(`${players[activePlayer].name}'s turn`);

    // We'll use this function to play the game in the console.
    const playRound = (row, col) => {
        let activeToken;

        const validMove = board.addToken(row, col, activeToken = players[activePlayer].token);
        board.printBoard();

        if(board.determineWinner(activeToken).isWin){
            players[activePlayer].score += 1;
            console.log('______________________________________');
            console.log(`${players[activePlayer].name} wins!`);
            console.log('______________________________________');
            setTimeout(() => {
                console.clear();
                board.initResBoard();
                console.log('To start Tic Tac Toe type "nameYourGame = startGame()".')
            }, 3000);
        } else if(board.determineWinner(activeToken).isTie){
            console.log('______________________________________');
            console.log(`It is a TIE!`);
            console.log('______________________________________');
            setTimeout(() => {
                console.clear();
                board.initResBoard();
                console.log('To start Tic Tac Toe type "nameYourGame = startGame()".')
            }, 3000);
        }else if(validMove && !board.determineWinner(activeToken).isWin && !board.determineWinner(activeToken).isTie){
            prevToken = players[player.getPlayer()].token
            activePlayer = player.changePlayer();
            activeToken = players[activePlayer].token;
            console.log(`${players[activePlayer].name}'s turn`);
        } else {
            console.log('Invalid move. Place your token elsewhere!');
            console.log(`${players[activePlayer].name}'s turn`);
        }
        return board
    };

    return {playRound, players};
}


(function (){
    const game = gameController()
    const gameCell = document.querySelectorAll('.game-cell');
    const scores = document.querySelectorAll('.points');

    const renderGame = (gameBoard) => {
        for(i = 0; i < gameCell.length; i++){
            gameCell[i].textContent = gameBoard.getBoard().flat()[i];
        };
        scores[0].textContent = game.players[0].score
        scores[1].textContent = game.players[1].score
    };

    // Event Listeners
    gameCell.forEach(cell => cell.addEventListener("click", () => {
        [row, col] = Array.from(cell.dataset.coordinates);
        const gameBoard = game.playRound(row, col);
        renderGame(gameBoard);
    }));
})();



