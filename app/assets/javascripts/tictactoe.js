// Code your JavaScript / jQuery solution here
const WIN_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2]
]

var turn = 0;

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

function updateState(box) {
  $(box).text(player());
}

function setMessage(msg) {
  $("#message").text(msg);
}

function checkWinner() {

}

function doTurn() {
  turn++;
  updateState(this);  //element that has been clicked!
  checkWinner();
}

function attachListeners() {

}
