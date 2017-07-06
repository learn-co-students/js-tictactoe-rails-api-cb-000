//  O |   | X  //
// ----------- //
//    | O | X  //
// ----------- //
//  O |   | X  //

var turnCount = 0
var winCombos = [[0,1,2],[0,3,6],[2,5,8],[6,7,8],[3,4,5],[1,4,7],[0,4,8],[6,4,2]]
var currentBoard = ["", "", "", "", "", "", "", "", ""]

// Current Player
function currentPlayer() {
	if (turnCount % 2 == 0) {
		return 'X'
	} else {
		return 'O'
	}
}

// Move Function
function move(event) {
  var square = $(event.target);
  
  // Lock Square Once Token is Placed
  square.is(':empty') ? square.html(currentPlayer()) : alert('This Position is Taken');

  // Update Local Board
  currentBoard[square.data("cell")] = currentPlayer();

  // Check For Win
  if (checkWinner()) {
    $('#message').text(`${currentPlayer()} wins!`);
    disableBoard();
    saveGame();
  }

  // Check For Tie
  if (checkTie()) {
    $('#message').text("Game is a tie!");
    disableBoard();
    saveGame();
  }

  // Increase Turn Counter
  if (!checkGameOver()) {
    turnCount++
  }
}

// Disable/Enable Board
function disableBoard() {
  $('tbody').off('click')
}

function enableBoard() {
  $('tbody').click(function(event) {
    move(event);
  });
}

// Check Winner
function checkWinner() {
  for (var i = 0; i < winCombos.length; i++) {
    if (currentBoard[winCombos[i][0]] == currentPlayer() && currentBoard[winCombos[i][1]] == currentPlayer() && currentBoard[winCombos[i][2]] == currentPlayer()) {
      return true
    }
  }
  return false
}

// Check Tie
function checkTie() {
  if (!currentBoard.includes("")) {
    return true
  }
  return false
}

// Check Game Over
function checkGameOver() {
  if (checkWinner() || checkTie()) {
    return true
  }
  return false
}

// Event Listeners
function eventListeners() {
  $('tbody').click(function(event) {
    move(event);
  });
  $('#js-clear').click(function(){
    resetBoard();
  })
  $('#js-games').click(function(){
    showGames();
  })
}

$(function () {
  eventListeners();
})

// Reset Board
function resetBoard() {
  var tableCells = $('td');
  tableCells.empty();
  $('#message').empty();
  turnCount = 0;
  clearLocalBoard();
  enableBoard();
}

// Reset Local Board
function clearLocalBoard() {
  currentBoard = ["", "", "", "", "", "", "", "", ""]
}

// Show Games

function showGames() {

  $.get("/games.json", function(response) {
    var games = response.data

    for(var i = 0; i < games.length; i++) {
      var gameState = games[i].attributes.state
      var gameId = games[i].id
      $('#games ol').append(
        "<li>Game_ID:" + gameId +
             "Game_STATE:" + gameState +
        "</li>")
    }
  });

}


// Save Game in Backend

function saveGame() {

  $.ajax({
    method: "POST",
    url: "/games",
    dataType: 'json',
    data: { game: { state: currentBoard } },
    success: function() {
      alert("Game Saved")
    },
    error: function() {
      alert("Game Not Saved")
    },
  })

}