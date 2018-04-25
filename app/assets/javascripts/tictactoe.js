$(document).ready(attachListeners)

let turn = 0
let board = ["", "", "", "", "", "", "", "", ""]

function player() {
  return turn % 2 === 0 ? "X":"O"
}

function updateState() {
  $(this).text(player())
}

function setMessage(message) {
  $("#message").text(message)
}

function checkWinner() {

}

function doTurn() {
  // checkWinner(), updateState(), increments turn, saves completed games
  updateState.bind(this)()
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
