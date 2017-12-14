// Code your JavaScript / jQuery solution here

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
