const Gameboard = {
  board : [],

  initializeBoard(){
    for (let i = 0; i < 9; i++) {
    this.board[i] = "";
}
  },

  printBoard(){
      console.log("|---|---|---|");
      console.log(`| ${this.board[0]} | ${this.board[1]} | ${this.board[2]} |`);
      console.log("|-----------|");
      console.log(`| ${this.board[3]} | ${this.board[4]} | ${this.board[5]} |`);
      console.log("|-----------|");
      console.log(`| ${this.board[6]} | ${this.board[7]} | ${this.board[8]} |`);
      console.log("|---|---|---|");
  },

  isSlotAvailable(slotNumber){
    return this.board[slotNumber - 1] === "";
  },

  placeMarker(slotNumber, marker){
    if (this.isSlotAvailable(slotNumber)) {
      this.board[slotNumber - 1] = marker;
      return true;
    } else {
      return false;
    }
  }

}


const player1 = {
  name: "Player 1",
  marker : "X"
}

const player2 = {
  name: "Player 2",
  marker: "O"
}

const GameController = {
  currentPlayer: player1,
  winner : null,

  switchPlayer(){
    this.currentPlayer = this.currentPlayer === player1 ? player2 : player1; 
  },

  checkDraw(){
    if (!Gameboard.board.some((slot) => slot === "")) {
        return true;
    }else{
        return false;
      }
  },
 
  checkWinner() {
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

        if(Gameboard.board[a] !== "" && Gameboard.board[b] !== "" && Gameboard.board[c] !== ""){
          if (Gameboard.board[a] === Gameboard.board[b] && Gameboard.board[b] === Gameboard.board[c]) {
          return Gameboard.board[a];
          }
        }
        
      }
      if(this.checkDraw()){
        return "draw";
      }
      return null;
  },

  playRound(slotNumber){
    if(this.winner !== null){
      console.log("The game is already over");
      return;
    }
    if(!Gameboard.placeMarker(slotNumber,this.currentPlayer.marker)){
      return;
    }
    Gameboard.printBoard();
    this.winner = this.checkWinner();
    if(this.winner === this.currentPlayer.marker){
      console.log(`${this.currentPlayer.name} (${this.currentPlayer.marker}) WINS!`);
      return;
    }else if(this.winner === "draw"){
      console.log("It is a DRAW");
      return;
    }
    this.switchPlayer();
  },

  startGame(){
    this.currentPlayer = player1;
    this.winner = null;
    Gameboard.initializeBoard();
    Gameboard.printBoard();

    while(this.winner === null){
      const input = prompt(`${this.currentPlayer.name}'s turn. Enter a slot number to place ${this.currentPlayer.marker} in:`);
      const numInput = Number(input);
      if (!Number.isInteger(numInput) || numInput < 1 || numInput > 9) {
        continue;
      }
      this.playRound(numInput);
    }
  }

}


GameController.startGame();