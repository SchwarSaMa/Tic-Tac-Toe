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

   return {initResBoard, getBoard, addToken, determineWinner};
}

function createPlayer(name, token) {
    const playerName = name;
    const playerToken = token;

    let score = 0;

    const addScore = () => score++;
    const deleteScore = () => score = 0;
    const getScore = () => score;

    return {playerName, playerToken, addScore, deleteScore, getScore} 
}

function determinePlayer(players) {
    let playerInd = Math.floor(Math.random() * 2);

    const getPlayer = () => players[playerInd];
    const changePlayer = () => {
        playerInd === 0 ? playerInd = 1 : playerInd = 0;
    };

    return {getPlayer, changePlayer};
}

function gameController (nameOne, nameTwo){
    const board = gameboard();
    const pOne = createPlayer(nameOne, 'X');
    const pTwo = createPlayer(nameTwo, 'O');
    const players = [pOne, pTwo];
    const detPlayer = determinePlayer(players);
    let activePlayer = detPlayer.getPlayer();
    console.log('anfang', detPlayer.getPlayer());
    

    board.initResBoard();

    const playRound = (row, col) => {
        const validMove = board.addToken(row, col, activeToken = detPlayer.getPlayer().playerToken);

        if(board.determineWinner(activeToken).isWin){
            detPlayer.getPlayer().addScore();
            board.initResBoard();
            detPlayer.changePlayer();
            activePlayer = detPlayer.getPlayer();
            console.log('win', detPlayer.getPlayer());
        } else if(board.determineWinner(activeToken).isTie){
            board.initResBoard();
            detPlayer.changePlayer();
            activePlayer = detPlayer.getPlayer();
            console.log('tie', detPlayer.getPlayer());
        }else if(validMove && !board.determineWinner(activeToken).isWin && !board.determineWinner(activeToken).isTie){
            detPlayer.changePlayer();
            activeToken = detPlayer.getPlayer().playerToken;
            activePlayer = detPlayer.getPlayer();
            console.log('round', detPlayer.getPlayer());
        } else {
            activePlayer = detPlayer.getPlayer();
            console.log('foul', detPlayer.getPlayer());
        }
        return [board, activePlayer];
    };

    return {playRound, players, activePlayer};
}


(function (){
    let game;
    let gameBoard;
    let activePlayer;
    const gameCell = document.querySelectorAll('.game-cell');
    const scores = document.querySelectorAll('.points');
    const quitGameBtn = document.querySelector('#quit-game-btn');
    const [initialScreen, gameScreen] = document.querySelectorAll('.screen');
    const createPlayerForm = document.querySelector('#create-player');
    const [namePOne, namePTwo] = document.querySelectorAll('.name');

    const renderGame = (gameBoard) => {
        for(i = 0; i < gameCell.length; i++){
            gameCell[i].textContent = gameBoard.getBoard().flat()[i];
        };
        scores[0].textContent = game.players[0].getScore();
        scores[1].textContent = game.players[1].getScore();
        if (activePlayer.playerName === namePOne.textContent) {
            namePOne.style.color = '#af5418';
            namePTwo.style.color = '#edf2fb';
        } else {
            namePTwo.style.color = '#af5418';
            namePOne.style.color = '#edf2fb';
        }
    };

    // Event Listeners
    gameCell.forEach(cell => cell.addEventListener("click", () => {
        [row, col] = Array.from(cell.dataset.coordinates);
        [gameBoard, activePlayer] = game.playRound(row, col);
        renderGame(gameBoard);
    }));
    createPlayerForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const [inputPOne, inputPTwo] = document.querySelectorAll('input');

        game = gameController(String(inputPOne.value), String(inputPTwo.value));
        namePOne.textContent = inputPOne.value;
        namePTwo.textContent = inputPTwo.value;

        initialScreen.style.display = 'none';
        gameScreen.style.display = 'grid';

        inputPOne.value = '';
        inputPTwo.value = '';
        game.activePlayer.playerName === namePOne.textContent
        ? namePOne.style.color = '#af5418'
        : namePTwo.style.color = '#af5418'
        
    });
    quitGameBtn.addEventListener('click', () => {
        game.players[0].deleteScore();
        game.players[1].deleteScore();
        gameBoard.initResBoard();
        renderGame(gameBoard);
        initialScreen.style.display = 'flex';
        gameScreen.style.display = 'none';
    });
})();



