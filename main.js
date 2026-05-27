const Gameboard = (() => {
  let board = [];

  const getBoard = () => [...board];

  const initializeBoard = () => {
    for (let i = 0; i < 9; i++) {
      board[i] = "";
    }
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

  return {getBoard, initializeBoard, isSlotAvailable, placeMarker };
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
    winner = checkWinner();

    if(winner !== null){
      return null;
    }

    switchPlayer();
    return null;
  };

  const startGame = () =>{
    currentPlayer = player1;
    winner = null;
    Gameboard.initializeBoard();

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
      button.classList.add("cell-button");
      button.textContent = element;
      button.addEventListener("click",(event)=>{
        const slotNumber = index + 1;
        const result = GameController.playRound(slotNumber);
        renderBoard();
        if(result !== null){
          messageArea.textContent = result;
        }else{
          renderMessage();
        }
      });
      cellsContainer.appendChild(button);
    });
  }

  const renderMessage = () =>{
    const winner = GameController.getWinner();
    const currentPlayer = GameController.getCurrentPlayer();
    if(winner === "X" || winner === "O" ){
      messageArea.textContent = `${currentPlayer.name} (${currentPlayer.marker}) WINS`;
    }else if(winner === "draw"){
      messageArea.textContent = "It's a DRAW";
    }else{
      messageArea.textContent = `${currentPlayer.name}'s (${currentPlayer.marker}) turn`;
    }
  }

  return {renderMessage,renderBoard};
})();

Gameboard.initializeBoard();
DisplayController.renderBoard();
DisplayController.renderMessage();