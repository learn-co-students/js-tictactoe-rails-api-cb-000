// Code your JavaScript / jQuery solution here
const WIN_COMBINATIONS = [
  [[0,0], [1,0], [2,0]],
  [[0,1], [1,1], [2,1]],
  [[0,2], [1,2], [2,2]],
  [[0,0], [0,1], [0,2]],
  [[1,0], [1,1], [1,2]],
  [[2,0], [2,1], [2,2]],
  [[0,0], [1,1], [2,2]],
  [[0,2], [1,1], [2,0]]
]

let turn = 0;
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

function saveGame() {
  console.log("I am saveGame!");
  if (currentGameId === "") {
    let  =
  }

}

function previousGames() {
  console.log("I am previousGames!");
}

function clearGame() {
  setBoard(["", "", "", "", "", "", "", "", ""]);
  currentGameId = "";
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
  turn++;
  updateState(cell);  //element that has been clicked!
  checkWinner();
}

function attachListeners() {
  $("td").on("click", function(event) {
    doTurn(event.target);
  });
  $("#save").on("click", function(event) {
    saveGame();
  });
  $("#previous").on("click", function(event) {
    previousGames();
  });
  $("#clear").on("click", function(event) {
    clearGame();
  });
}

$(document).ready(function() {
  attachListeners();
});
