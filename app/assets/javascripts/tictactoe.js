// Code your JavaScript / jQuery solution here
const WIN_COMBINATIONS =  [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
var turn = 0;
function player(){
  if (turn % 2 === 0){
    return "X";
  }else{
    return "O";
  }
}

function updateState(position){
  let token = player();
  position.innerHTML = token;
}

function setMessage(message){
  let messageElement = document.getElementById('message');
  messageElement.innerHTML = message;
}

function checkWinner(){
  WIN_COMBINATIONS.forEach(function(combo){
    let one = combo[1];
    let two = combo[2];
    let three = combo[3];




  })
}
var td = document.getElementsByTagName('td');
