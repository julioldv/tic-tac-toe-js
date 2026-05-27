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
      return "The game is already over";
    }
    if(!Gameboard.placeMarker(slotNumber,currentPlayer.marker)){
      return "Slot is already taken";
    }
    Gameboard.printBoard();
    winner = checkWinner();
    if(winner === currentPlayer.marker){
      return `${currentPlayer.name} (${currentPlayer.marker}) WINS!`;
      return;
    }else if(winner === "draw"){
      return "It is a DRAW";
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

const DisplayController = (()=>{
  const cellsContainer = document.querySelector(".cells-container");
  const messageArea = document.querySelector(".message-area");

  const renderBoard = () =>{
    cellsContainer.innerHTML = "";
    const board = Gameboard.getBoard();

    board.forEach((element,index) => {
      const button = document.createElement("button");
      button.textContent = element;
      button.addEventListener("click",(event)=>{
        const slotNumber = index + 1;
        //GameController.playRound(slotNumber);
        messageArea.textContent = GameController.playRound(slotNumber);
        renderBoard();
      });
      cellsContainer.appendChild(button);
    });
  }

  return {renderBoard};
})();

Gameboard.initializeBoard();
DisplayController.renderBoard();