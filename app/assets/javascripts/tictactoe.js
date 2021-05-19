var turn = 0

let currentGame = 0

const WIN_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ]

function player() {
  if(turn % 2 === 0)
  return "X"
  else
  return "O"
}

function updateState(td) {
  td.innerHTML = player();
}

function setMessage(str) {
  $("#message").text(str)
}

function populateBoard(array) {
  if (array.length === 0) {
    resetBoard();
  } else {
    for (var i = 0; i < array.length; i++) {
      $("td")[i].innerHTML = array[i];
    }
    turn = turnCount();
  }
}

function turnCount() {
  counter = 0
  for (var i = 0; i < 9; i++) {
    if ($("td")[i].innerHTML === "X" || $("td")[i].innerHTML === "O") {
      counter++
    }
  }
  return counter
}

function createStateArray() {
  var array = new Array();
  $("table td").each(function(element){
    var el = $(this)
    array.push(el.text())
  })
  return array
}

function previousGames() {
  $.get("/games")
  .done(function(data){
    var $games = $("#games");
    $games.empty();
    $.each(data.data, function(index){
      $games.append("<button data-id="+data.data[index]["id"]+">"+data.data[index]["id"]+".game</button><br>");
    });
    $("button[data-id]").on("click", getGame);
  });
}

function saveGame() {
  var state = createStateArray();
  if (currentGame > 0) {
    $.ajax({
      method: "PATCH",
      url:"/games/"+currentGame,
      data:{state:state}
    });
  }else{
    $.post("/games",{state:state})
    .done(function(data){
      currentGame = parseInt(data.data["id"]);
    });
  }
}

function getGame() {
  $.get("/games/"+parseInt(this.dataset["id"]))
  .done(function(data){
    currentGame = parseInt(data.data["id"]);
    populateBoard(data.data["attributes"]["state"]);
  });
}

function checkWinner() {
  if(playerWon("X") === true){
    setMessage("Player X Won!");
    return true;
  } else if (playerWon("O") === true){
    setMessage("Player O Won!");
    return true;
  } else {
    return false;
  }
}

function playerTokens(token) {
  let tokens = []
  $("td").each(function(index){
    if($(this).text() == token) {
      tokens.push(index)
    }
  });
  return tokens;
}

function playerWon(token) {
  let tokens = playerTokens(token)
  let winner = false

  WIN_COMBINATIONS.forEach(function(game){
    if(game.every((val) => tokens.includes(val)) == true) {
      winner = true
    }
  });
  return winner
}

function clearBoard() {
  $("td").each(function(index){
    $(this).text("");
  });
  currentGame = 0;
  turn = 0;
}

function doTurn(token) {
  updateState(token);

  if(checkWinner()){
    saveGame();
    clearBoard();
  } else if(turn === 8) {
    setMessage("Tie game.")
    saveGame();
    clearBoard();
  } else {
    turn++
  }
}

$(document).ready(function() {
  attachListeners();
});

function attachListeners() {

  $('td').on('click', function() {
    if (!$.text(this) && !checkWinner()) {
      doTurn(this);
    }
  });

  $('#clear').on('click', function() {
    clearBoard();
  });

  $('#previous').on('click', function() {
    previousGames();
  });

  $('#save').on('click', function() {
    saveGame(this);
  });
}
