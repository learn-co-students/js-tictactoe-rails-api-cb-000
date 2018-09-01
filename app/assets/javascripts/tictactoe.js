var turn  = 0;

const win_combinations = [
  [[0,0],[1,0],[2,0]],
  [[0,1],[1,1],[2,1]],
  [[0,2],[1,2],[2,2]],
  [[0,0],[0,1],[0,2]],
  [[1,0],[1,1],[1,2]],
  [[2,0],[2,1],[2,2]],
  [[0,0],[1,1],[2,2]],
  [[0,2],[1,1],[2,0]]
]

function player() {
  let player = turn % 2 == 0 ? "X" : "O";
  return player;
}

function updateState(element) {
  if ($(element).html() !== "") {
    return false;
  }
  $(element).html(`${player()}`);
  return true;
}

function setMessage(string) {
  $('div#message').html(string);
}

function checkWinner() {
  let winner;

  win_combinations.forEach(function (comb) {
    let val_1 = $(`[data-x='${comb[0][0]}'][data-y='${comb[0][1]}']`).html();
    let val_2 = $(`[data-x='${comb[1][0]}'][data-y='${comb[1][1]}']`).html();
    let val_3 = $(`[data-x='${comb[2][0]}'][data-y='${comb[2][1]}']`).html();

    if ( val_1 !== "" && val_1 === val_2 && val_1 === val_3 ) {
      winner = val_1;
      return;
    }
  });

  if (winner !== undefined ) {
    winner === "X" ? setMessage('Player X Won!') : setMessage('Player O Won!');
    return true;
  } else {
    return false;
  }

} // checkWinner()


function doTurn(element) {
  let updated = updateState(element);
  if (!updated) {
    return;
  }
  if (checkWinner()) {
    saveGame();
    clearGame();
    return;
  }
  turn += 1;
  if (turn === 9) {
    saveGame();
    setMessage('Tie game.');
    clearGame();
    return;
  }
}

function attachListeners() {
  // Update state
  $('td').click(function() {
    doTurn(this);
  });
  // Save Game
  $("#save").click(function() {
    saveGame();
  });
  // Previous Games
  $("#previous").click(function() {
    previousGames();
  });
  // Clear Game
  $("#clear").click(function() {
    clearGame();
  });
}

function saveGame() {
  //  if click 1 -> save (even if blank)
  // if click 2 -> update (even if blank)
  // if click 3,4,etc -> update (even if blank)
  let elements = $("td");
  let board = [];
  elements.each(function() {
    let val = $(this).html();
    board.push(val);
  });
  game = {state: board}
  var posting = $.post('/games', game);
    posting.done(function(data) {
      setMessage("Save Successful!");
    });
}

function clearGame() {
  // creates new game and displays it
  turn = 0;
  $("td").html("");
  //var posting = $.post('/games');
  //posting.done(function(data) {
  //  e = data;
  //});
}

function previousGames() {
  $.get("/games", function(data) {
    var games = "<ul>";
    data.data.forEach(function(game) {
      games += "<li>" + game.id + "</li>";
    });
    games += "</ul>";
    $('#games').html(games);
  });
}

$(document).ready(function() {
  attachListeners();
})
