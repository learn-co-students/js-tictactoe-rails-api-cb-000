// Code your JavaScript / jQuery solution here

var turn = 0;
var currentGame = 0;

const SOLUTIONS = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
]

function player(){
  return turn % 2 === 0 ? "X" : "O"
}

function updateState(el){
  let token = player();
  $(el).text(token)
}

function setMessage(message){
  $("#message").html(message)
}

function checkWinner(){
  var board = {};
  var winner = false;

  $('td').text((index, square) => board[index] = square);

  SOLUTIONS.some(function(combo) {
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      setMessage(`Player ${board[combo[0]]} Won!`);
      return winner = true;
    }
  });

  return winner;
}

function doTurn(square){
  updateState(square)
  ++turn;
  if(checkWinner()){
    resetBoard();
  } else if(turn === 9){
    setMessage("Tie game.")
    resetBoard();
  }
}

function resetBoard() {
  $('td').empty();
  turn = 0;
  currentGame = 0;
}

// function showPreviousGames() {
//   $('#games').empty();
//   $.get('/games', (savedGames) => {
//     if (savedGames.data.length) {
//       savedGames.data.forEach(buttonizePreviousGame);
//     }
//   });
// }

function attachListeners() {
  $('td').on('click', function() {
    if (!$.text(this) && !checkWinner()) {
      doTurn(this);
    }
  });

  $('#save').on('click', () => saveGame());
  $('#previous').on('click', () => showPreviousGames());
  $('#clear').on('click', () => resetBoard());
}

attachListeners();
