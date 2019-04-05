var turn = 0 ;
var game = 0 ;
var saved = false ;

const winCombos = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
]
function player(){
  var dude;
  turn % 2 === 0 ? dude = 'X' : dude = 'O'
  return dude
}

$( document ).ready(function() {
  attachListeners() ;
});

function attachListeners(){
  $("td").on("click", function(){
    var spot = this ;
    if (spot.innerHTML === "" && !checkWinner()) {doTurn(spot)} ;
  })
  $("#save").on("click", function(){
    saveGame() ;
  })
  $("#previous").on("click", function(){
    previousGame() ;
  })
  $("#clear").on("click", function(){
    clearGame() ;
  })
}

function saveGame(){
  var state = [] ;
  var spots = $('td')
  for (var i = 0; i < 9; i++){
    state.push(spots[i].innerHTML) ;
  }
  var stateData = {state: state} ;
  if (saved){
    $.ajax({
      type: 'PATCH',
      url: `/games/${game}`,
      data: stateData
    });
  }
  else {
    $.post(`/games`, stateData, function(json){
      game = json.data.id ;
      $('#games').append(`<button id="game-${json.data.id}">${json.data.id}</button>`);
      $(`#game-${json.data.id}`).on('click', function(){
         remakeGame(json.data.id)
       });
    })
    saved = true ;
  }
}
function remakeGame(id){
  fetch(`/games/${id}`)
  .then(res => res.json())
  .then(function(json){
    console.log('remake game') ;
    game = id ;
    saved = true ;
    for (var i = 0 ;i < 9 ; i++ ){
      $('td')[i].innerHTML = json.data.attributes.state[i]
    }
    console.log(json.data.attributes.state);
  })
}
function previousGame(){
  console.log("previous")
  fetch('/games')
  .then(res => res.json())
  .then(function(json){
    console.log('previous game')
    console.log(json.data);
    json.data.forEach(function(match){
      $('#games').append(`<button id="game-${match.id}">${match.id}</button>`);
      $(`#game-${match.id}`).on('click', function(){
         remakeGame(match.id)
       });
    })
  })
}
function clearGame(){
  console.log("clear") ;
  game = 0 ;
  turn = 0 ;
  saved = false ;
  for (var i = 0; i < 9; i++){
  $('td')[i].innerHTML = "" ;
  }
}
function doTurn(spot){
  console.log(spot) ;
  updateState(spot) ;
  turn++ ;
  checkWinner() ;
}
function updateState(spot){
  var token = player() ;
  spot.innerHTML = token ;
}
function setMessage(message){
  document.getElementById('message').innerHTML = message ;
}
function checkWinner(){
  if(didwin('X')){
    setMessage('Player X Won!')
    clearGame() ;
    return true
  }
  else if(didwin('O')){
    setMessage('Player O Won!') ;
    clearGame() ;
    return true
  }
  else if(turn === 9){
    setMessage('Tie game.') ;
    clearGame() ;
  }
  else{
    console.log(turn);
    return false
  }
}
function didwin(token){
  var board = $('td') ;
  var won = winCombos.some(function(combo){
    return(
      combo.every(function(space){
        return(
          board[space].innerHTML === token
        )
      })
    )
  })
  return won ;
}
