var turn  = 0;
var game_id = false;

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
  // Load Game
  $('div#games').on('click', $("button"), function(e) {
    let data_id = $(e.target).attr("data-id");
    loadGame(data_id);
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
  let tds = $("td");
  let board = [];
  tds.each(function() {
    let val = $(this).html();
    board.push(val);
  });
  if (game_id) {
    game = {id: game_id, state: board}
    $.ajax({
      url: `/games/${game_id}`,
      data: game,
      dataType: "json",
      method: "PATCH"
    })
    .success(function(resp) {
      setMessage("Update Successful!");
    })
  } else {
    game = {state: board}
    var posting = $.post('/games', game);
      posting.done(function(resp) {
        game_id = resp["data"]["id"]
        setMessage("Initial Save Successful!");
      });
  }
}

function clearGame() {
  // creates new game and displays it
  game_id = false;
  turn = 0;
  $("td").html("");
  //var posting = $.post('/games');
  //posting.done(function(data) {
  //  e = data;
  //});
}

function previousGames() {
  $.get("/games", function(resp) {
    if (resp.data.length !== 0) {
      var games = "<br><h3>Previous Games</h3>";
      resp.data.forEach(function(game) {
        games += `<button data-id="${game.id}">Game ${game.id}</button><br>`;
      });
      $('#games').html(games);
    }
  });
}

function loadGame(id) {
  $.get(`/games/${id}`, function(resp) {
    game_id = parseInt(resp["data"]["id"])
    var state = resp["data"]["attributes"]["state"]
    turn = state.filter(pos => pos !== "").length
    setBoard(state);
  });
}

function setBoard(state) {
  var tds = $("td")
  tds.each(function() {
    $(this).html(state.shift());
  });
}

$(document).ready(function() {
  attachListeners();
})
