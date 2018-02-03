// GAME CONFIG

window.turn = 0;
window.currentGame = 0;
const winningCombos = [
  // across
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // up and down
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // diagonal
  [0, 4, 8],
  [2, 4, 6]
]

$(document).ready(function() {
  attachListeners();
});
$(window).on('load', function() {
  window.squares = $('td');
});



// LISTENERS 

function attachListeners() {
  // Square clicks
  $('td').on('click', function() {
    if (!checkWinner()) doTurn(this);
  });

  // Previous button click
  $('#previous').on('click', function() {
    showPrevious();
  });

  // Save button click
  $('#save').on('click', function() {
    saveGame();
  });

  // Clear button click
  $('#clear').on('click', function() {
    resetBoard();
  });
}



// GAMEPLAY FUNCTIONS

function checkDraw() {
  if (turn === 9 && !checkWinner()) {
    setMessage('Tie game.')
    saveGame();
    resetBoard();
  }
}

function checkWinner() {
  let board = $.map(window.squares, val => val.innerHTML);

  for (let i = 0; i < winningCombos.length; i++) {
    let pos_one = winningCombos[i][0];
    let pos_two = winningCombos[i][1];
    let pos_three = winningCombos[i][2];

    if (board[pos_one] && board[pos_one] === board[pos_two] && board[pos_two] === board[pos_three]) {
      setMessage(`Player ${board[pos_one]} Won!`);
      return true;
    }
  }
  return false;
}

function doTurn(clicked) {
  if (!squareTaken(clicked)) {
    updateState(clicked);
    turn++
  }
  if (checkWinner()) {
    saveGame();
    resetBoard();
  } else {
    checkDraw();
  }
}

function player() {
  return window.turn ? (window.turn % 2 === 0 ? 'X' : 'O') : 'X';
}

function squareTaken(clicked) {
  return $(clicked).text() !== '';
}

function setMessage(message) {
  $('#message').text(message);
}

function updateState(clicked) {
  $(clicked).text(player());
}



// AJAX INTERACTIONS WITH RAILS

function loadGame(clicked) {
  let gameId = $(clicked).data('id');
  currentGame = gameId

  $.get('/games/' + gameId, function(data) {
    let state = data['data']['attributes']['state']

    $('td').each(function(index) {
      $(this).text(state[index])
      if(state[index]) turn++;
    });  
  });
}

function resetBoard() {
  turn = 0;
  currentGame = 0;
  $('td').empty();
}

function saveGame() {
  let state = $.map(squares, val => val.innerHTML);
  let values = { state: state };

  if (currentGame) {
    $.ajax({
      method: 'PATCH',
      url: '/games/' + currentGame,
      data: values
    });
  } else {
    $.post('/games', values, function(data) {
      currentGame = data['data']['id']
    });
  }
}

function showPrevious() {
  $.get('/games', function(data) {
    let games = data['data'];
    for(let i = 0; i < games.length; i++) {
      gameId = games[i]['id']
      let toAppend = `<button class="load-game" data-id="${gameId}" onclick="loadGame(this);">${gameId}</button>`
      if($('#games').html().indexOf(toAppend) === -1) $('#games').append(toAppend);
    }
  });
}
