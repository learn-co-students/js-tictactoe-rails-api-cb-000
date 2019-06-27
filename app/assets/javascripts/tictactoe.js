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

function saveGame() {
  console.log("I am saveGame!");
}

function previousGame() {
  console.log("I am previousGame!");
}

function clearGame() {
  console.log("I am clearGame!");
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
}

$(document).ready(function() {
  attachListeners();
});
