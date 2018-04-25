$(document).ready(attachListeners)

var turn = 0

function player() {
  return ((turn % 2 === 0) ? "X":"O")
}

function updateState() {
  $(this).text(player())
}

function setMessage(message) {
  $("#message").text(message)
}

function checkWinner() {
  var wins = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]
  board = createBoardArray()
  result =  wins.some(function (combo) {
    if(board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]] && board[combo[0]] != ""){
      setMessage(`Player ${player()} Won!`)
      return true;
    }
  })
  return result
}

function doTurn() {
  // checkWinner(), updateState(), increments turn, saves completed games
  updateState.bind(this)()
  var result = checkWinner()
  if(turn >= 8){
    setMessage("Tie game.")
  }
  turn ++
}

function attachListeners() {
  $("td").on("click", doTurn)
  $("#save").on("click", saveGame)
  $("#previous").on("click", previousGame)
  $("#clear").on("click", clearGame)
  $("js-game").on("click", loadGame)
}

function saveGame(e){
  e.preventDefault
  //checks to see if current game is saved. If not, it saves it.
  alert("saving game")
}

function previousGame(e){
  $.get('/games', function(resp){
    //adds buttons of previous games to the DOM
    //each button should be able to send a get request to "/games/:id"
    alert("looking for games")
  })
}

function clearGame(e) {
  alert("clearing board")
}

//game buttons as js-game
function loadGame(){
  let id = $(this).data("id")
  alert(`looking for ${id}`)
}


function createBoardArray() {
  let count = 0
  let board = []
  for(let y = 0; y < 3; y++ ){
    for(let x = 0; x < 3; x++){
      board[count] = $(`[data-x="${x}"][data-y="${y}"]`).text()
      count ++
    }
  }
  return board
}
