$(document).ready(attachListeners)

var turn = 0
var board = function () {
  clearGame()
  return createBoardArray()
}
var id = 0

function player() {
  return ((turn % 2 === 0) ? "X":"O")
}

function updateState(square) {
  if($(square).text() == ""){
    $(square).text(player())
    return true
  } else {
    return false
  }
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

function doTurn(square) {
  square = this
  // checkWinner(), updateState(), increments turn, saves completed games
  // updateState(square)
  var approvedMove = updateState(square)
  var result = checkWinner()
  if (turn >= 8){
    setMessage("Tie game.")
  }
  if(result || turn> 8){
    saveGame()
    clearGame()
    board = createBoardArray()
    turn = 0
  } else {
    if(approvedMove) {
      turn ++
    }
  }

}

function attachListeners() {
  $("td").on("click", doTurn)
  $("#save").on("click", saveGame)
  $("#previous").on("click", previousGame)
  $("#clear").on("click", clearGame)
}

function saveGame(){
  if(id === 0) {
    var posting = $.post("/games", JSON.stringify(board))
    posting.done(function(game){
      id = game["data"]["id"]
    })
  } else {
    $.post("/games/" + id, {_method: "PATCH", state: JSON.stringify(board) })
  }
}

function previousGame(e){
  $.get('/games').done(function(data) {
    var i = $("#games > button").length
    for(i; i < data["data"].length; i++) {
      var id = data["data"][i]["id"]
      $("#games").append('<button class="js-game" id="'+ id +'">' + id + '</button>')
    }
    $(".js-game").on("click", loadGame)
  })
}

function clearGame() {
  var squares = $("td")
  for(var i = 0; i < squares.length; i++ ){
    squares[i].innerHTML = ""
    }
  id = 0
}

//game buttons as js-game
function loadGame(){
  var id = $(this).attr("id")
  $.get("/games/"+ id).done(function(data){
    id = data["data"]["id"]
    board = data["data"]["attributes"]["state"]
    createBoard()
    turn = setTurn()
  })
}


function createBoardArray() {
  var count = 0
  var board = []
  for(var y = 0; y < 3; y++ ){
    for(var x = 0; x < 3; x++){
      board[count] = $(`[data-x="${x}"][data-y="${y}"]`).text()
      count ++
    }
  }
  return board
}

function createBoard() {
  var squares = $("td")
  for(var i = 0; i < squares.length; i++ ){
    squares[i].innerHTML = board[i]
    }
  id = 0
}

function setTurn() {
  var squares = $("td")
  var count = 0
  for(var i = 0; i < 9; i++) {
    if(squares[i].innerHTML != "") {
      count++
    }
  }
  return count
}
