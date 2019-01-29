var turn = 0;
let gameId = 0;
const WINNING_COMBINATIONS = [ [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6] ];

$(function() {
  attachListeners();
});

function player(){
  if (turn % 2 === 0) {return "X"} else {return "O"};
}

function updateState(square){
  $(square).html(player());
}

function setMessage(message) {
  $('div#message').html(message);
}

function checkWinner() {
  let winner = false;
  let board = [];
  $('td').text((i, element) => board[i] = element);
  WINNING_COMBINATIONS.find(function(combination){
    if (board[combination[0]] !== "" && board[combination[0]] === board[combination[1]] && board[combination[0]] === board[combination[2]]) {
      setMessage(`Player ${board[combination[0]]} Won!`)
      winner = true;
    }
  })
  return winner;
}

function doTurn(square){
  if (square.innerHTML === "") {
    updateState(square);
    turn++;
    if (checkWinner()){
      save();
      clear();
    } else if (turn > 8) {
      setMessage('Tie game.');
      save();
      clear();
    }
  }
}

function attachListeners(){
  $("td").click(function(){
    if (!checkWinner()){
      doTurn(this);
    }
  });
  $('#save').click(save);
  $('#previous').click(previous);
  $('#clear').click(clear);
}

function save() {
  let state = [];
  $('td').text((index, square) => {
    state.push(square);
  });
  if (gameId) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${gameId}`,
      data: {state: state}
    })
  } else {
    $.post('/games', {state: state}, function(game){
      gameId = game['data']['id']
    })
  };
}

function previous() {
  let games = "";
  $.get('/games', function(gamesList){
    if (gamesList.data.length > 0){
      gamesList['data'].forEach(function(game){
        games += '<button class="saved" id="' + game.id + '">' + game.id + '</button><br>'
      })
      $('#games').html(games);
    }
    $(".saved").click(loadSave);
  })
}

function loadSave(){
  id = $(this).attr('id')
  $.get('/games/' + id, function(game){
    let state = game['data']['attributes']['state']
    $.each($('td'), function(index, square){
      square.innerHTML = state[index]
    })
    turn = state.join("").length;
    gameId = id;
  })
  $('#games').empty();
  setMessage("");
}

function clear() {
  $("td").html("");
  turn = 0;
  gameId = 0;
}
