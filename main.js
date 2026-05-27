const Gameboard = (() => {
  let board = [];

  const getBoard = () => [...board];

  const initializeBoard = () => {
    for (let i = 0; i < 9; i++) {
      board[i] = "";
    }
  };

  const printBoard = () => {
    console.log("|---|---|---|");
    console.log(`| ${board[0]} | ${board[1]} | ${board[2]} |`);
    console.log("|-----------|");
    console.log(`| ${board[3]} | ${board[4]} | ${board[5]} |`);
    console.log("|-----------|");
    console.log(`| ${board[6]} | ${board[7]} | ${board[8]} |`);
    console.log("|---|---|---|");
  };

  const isSlotAvailable = (slotNumber) => {
    return board[slotNumber - 1] === "";
  };

  const placeMarker = (slotNumber, marker) => {
    if (isSlotAvailable(slotNumber)) {
      board[slotNumber - 1] = marker;
      return true;
    }

    return false;
  };

  return {getBoard, initializeBoard, printBoard, isSlotAvailable, placeMarker };
})();

function createPlayer(name,marker){
  return {name,marker};
}

const player1 = createPlayer("Player 1", "X");
const player2 = createPlayer("Player 2", "O");


const GameController = (()=>{

  let currentPlayer = player1;
  let winner = null;

  const getCurrentPlayer = () => ({...currentPlayer});
  const getWinner = () => winner;

  const switchPlayer = () =>{
    currentPlayer = currentPlayer === player1 ? player2 : player1; 
  };

  const checkDraw = () =>{
    return !Gameboard.getBoard().some((slot) => slot === "");
  };

  const checkWinner = ()=>{
      const board = Gameboard.getBoard();
      const winningLines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ];

      for (const line of winningLines) {
        const [a, b, c] = line;

          if (board[a] !== "" && board[a] === board[b] && board[b] === board[c]) {
          return board[a];
          }
        
      }
      if(checkDraw()){
        return "draw";
      }
      return null;
  };

  const playRound = (slotNumber)=>{
    if(winner !== null){
      console.log("The game is already over");
      return;
    }
    if(!Gameboard.placeMarker(slotNumber,currentPlayer.marker)){
      return;
    }
    Gameboard.printBoard();
    winner = checkWinner();
    if(winner === currentPlayer.marker){
      console.log(`${currentPlayer.name} (${currentPlayer.marker}) WINS!`);
      return;
    }else if(winner === "draw"){
      console.log("It is a DRAW");
      return;
    }
    switchPlayer();
  };

  const startGame = () =>{
    currentPlayer = player1;
    winner = null;
    Gameboard.initializeBoard();
    Gameboard.printBoard();

    while(winner === null){
      const input = prompt(`${currentPlayer.name}'s turn. Enter a slot number to place ${currentPlayer.marker} in:`);
      const numInput = Number(input);
      if (!Number.isInteger(numInput) || numInput < 1 || numInput > 9) {
        continue;
      }
      playRound(numInput);
    }
  }

  return {getCurrentPlayer, getWinner, playRound, startGame};
})();

GameController.startGame();