// Code your JavaScript / jQuery solution here

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

function updateState() {

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
