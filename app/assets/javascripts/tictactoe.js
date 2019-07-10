const WIN_COMBINATIONS = [
  [[0,0], [1,0], [2,0]], [[0,1], [1,1], [2,1]],[[0,2], [1,2], [2,2]],
  [[0,0], [0,1], [0,2]],[[1,0], [1,1], [1,2]],[[2,0], [2,1], [2,2]],
  [[0,0], [1,1], [2,2]],[[0,2], [1,1], [2,0]]
]
var turn = 0;
let currentGameId = "";

function serializeBoard() {
  let boardState = [];
  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 3; x++) {
      boardState.push($(`[data-x=${x}][data-y=${y}]`).text());
    }
  }
  return boardState;
}

function setBoard(boardArray) {
  let index = 0;
  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 3; x++) {
      $(`[data-x=${x}][data-y=${y}]`).text(boardArray[index]);
      index++;
    }
  }
}

function loadGame(id) {
  $.get('/games/' + id, function(data) {
    setBoard(data["data"]["attributes"]["state"]);
    turn = 0;
    for(let i = 0; i < 9; i++) {
      if (data["data"]["attributes"]["state"][i] !== "") {
        turn++;
      }
    }
    currentGameId = id;
  });
}

function saveGame() {
  if (currentGameId === "") {
    let saving = $.post('/games', {state: serializeBoard()});
    saving.done(function(data) {
      currentGameId = data["data"]["id"];
    });
  } else {
    $.ajax({
       type: 'PATCH',
       url: `/games/${currentGameId}`,
       data: {state: serializeBoard()},
    });
  }
}

function previousGames() {
  $.get('/games', function(data) {
    let gameList = "";
    data["data"].forEach(function(game) {
      gameList += `<button onclick=\"loadGame(${game["id"]})\">Load Game ${game["id"]}</button>`;
    });
    if (data["data"].length > 0) {
        $("#games").html(gameList);
    }
  });
}

function clearGame() {
  setBoard(["", "", "", "", "", "", "", "", ""]);
  currentGameId = "";
  turn = 0;
}

function player() {
  return ((turn % 2 === 0) ? "X" : "O");
}

function updateState(cell) {
  $(cell).text(player());
}

function setMessage(msg) {
  $("#message").text(msg);
}

function checkWinner() {
  let winner = "";
  WIN_COMBINATIONS.forEach(function(row) {
    const boxText1 = $(`[data-x=${row[0][0]}][data-y=${row[0][1]}]`).text();
    const boxText2 = $(`[data-x=${row[1][0]}][data-y=${row[1][1]}]`).text();
    const boxText3 = $(`[data-x=${row[2][0]}][data-y=${row[2][1]}]`).text();
    if (boxText1 === boxText2 && boxText2 === boxText3 && boxText3 !== "") {
      winner = boxText1;
    }
  });
  if (winner !== "") {
    setMessage(`Player ${winner} Won!`);
    return true;
  }
  return false;
}

function doTurn(cell) {
  updateState(cell);
  let winner = checkWinner();
  if (winner === false && turn === 8) {
    setMessage("Tie game.");
    saveGame();
    clearGame();
    return;
  }
  if (winner === true) {
    saveGame();
    clearGame();
    return;
  }
  turn++;
}

function attachListeners() {
  $("td").on("click", function() {
    if (!$.text(this) && !checkWinner()) {
        doTurn(this);
    }
  });
  $("#save").on("click", () => saveGame());
  $("#previous").on("click", () => previousGames());
  $("#clear").on("click", () => clearGame());
}

$(document).ready(function() {
  attachListeners();
});
