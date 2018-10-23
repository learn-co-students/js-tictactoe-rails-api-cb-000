// Code your JavaScript / jQuery solution here
const winningCombinations = [[0,1,2],[3,4,5],[6,7,8],[0,4,8],[2,4,6],[0,3,6],[1,4,7],[2,5,8]]
var turn = 0;
var currentGame = null;

$(function(){
  attachListeners();
})

function player(){
  return turn % 2 == 0 ? "X" : "O"
}

function updateState(element){
  element.innerHTML = player();
}

function setMessage(string){
  $('#message').html(string)
}

function getBoard(){
  let board = []
  for (let node of $('td')){
    board.push(node.innerHTML)
  }
  return board
}

//check winner
function checkWinner(){
  let board = getBoard();

  function winningGame(player){
    let result = winningCombinations.find((combo) => {
      return combo.every(index=> {
        return board[index] == player
      });
    });
    return result
  }

  let result = ["X","O"].find(player => {
    return winningGame(player)
  });

  if (result != null) {
    setMessage(`Player ${result} Won!`)
    return true
  } else {
    return false
  }
}

// Group of functions and steps done every turn
function doTurn(element){
  updateState(element);
  turn++;
  if (checkWinner()) {
    clearGame();
  } else if (!openSpaces()) {
    setMessage("It's a draw.")
    clearGame();
  } else {
    setMessage("Tie game.")
  }
}

function loadGame(element){
  $.get(element.dataset.url, function(response){
    let board = response.data.attributes.state
    currentGame = parseInt(response.data.id)
    $('td').text((index, value) =>{
      return board[index]
    });
    let count = 0;
    for (let element of $('td') ){
      element.innerText != "" ? count++ : count += 0;
    }
    turn = count;
  })
}

function saveGame() {
  let board = getBoard();
  let empty = board.every((space) => space == '' )
  if (currentGame && !checkWinner()) {
    $.ajax({
      url: `/games/${currentGame}`,
      type: "PATCH",
      data: {'state': board}
    })
  } else if (!empty){
    $.post('/games', {'state': board}, (response) => {
      currentGame = response.data.id;
    })
  }
}

function clearGame() {
  turn = 0;
  currentGame = null;
  $('td').text((value) => {
    return ''
  });
}

function previousGames() {
  $.get('/games', response => {
  let string = ''
  for (let el of response.data){
    string += `<li><a href="#" data-id="${el.id}"onclick="loadGame(this);return false;" data-url="/games/${el.id}">${el.id}</a></li>`
  }
  let html = `<ul>${string}</ul>`
  $('#games').html(html)
  })
}

function openSpaces(){
  let board = getBoard();
  // let result = board.every((space) => space != '' )
  return !board.every((space) => space != '')
}




//ATTACH LISTENERS
function attachListeners(){
  //add listeners to tic tac toe panels
  $('td').click((element)=>{
    return doTurn(element.toElement);
  })

  //add listener to previous game button
  $('#previous').on('click', () => previousGames())

  //add a listener to save game button
  $('#save').on('click', () => saveGame())

  //add a listener to clear game button
  $('#clear').on('click', () => clearGame())
}
