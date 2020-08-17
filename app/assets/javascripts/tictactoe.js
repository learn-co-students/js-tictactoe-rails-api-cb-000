// Code your JavaScript / jQuery solution here

$(document).ready(function() {
  // executed after full DOM load, as you don't want to attempt to add listeners to elements that might not exist yet
  attachListeners();
});

var winningCombos = [
  [0,1,2], // top row
  [3,4,5], // middle row
  [6,7,8], // bottom row
  [0,3,6], // first column
  [1,4,7], // second column
  [2,5,8], // third column
  [0,4,8], // diagonal top to bottom
  [2,4,6]  // diagonal bottom to top
];

var turn = 0; 

var currentGame = 0;

// return the appropriate token depending on turn count (X always goes first)
function player() {
  return (turn % 2 == 0 ? "X" : "O");
};

// pass in the square being played and set its contents to the playing token
function updateState(square) {
  var content = player();
  $(square).html(content); // solution uses .text
};

// update #message with whatever string is passed in
function setMessage(string) {
  $('#message').text(string);
};

// pass in the square being played, increment the turn counter, invoke updateState, checkWinner, etc
function doTurn(square) {
  // reverse these two to have different token start the game
  updateState(square);
  turn++;
  
  if (checkWinner()) {
    saveGame();
    resetBoard();
  } else if (turn === 9) {
    setMessage("Tie game.");
    saveGame();
    resetBoard();
  };
}

// start with an empty board object
function checkWinner() {
  var board = {};
  var winner = false;
  // fill the board object with index/square-value pairs
  $('td').text((index, square) => board[index] = square);

  // iterate through the winning combos for a match, returns true/false
  winningCombos.some(function(combo) {
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) 
      { setMessage(`Player ${board[combo[0]]} Won!`);
        return winner = true;
      }
  });

  return winner;
}

function saveGame() {
  var state = [];
  var gameData;

  // fill state array with board values
  $('td').text((index, square) => {
    state.push(square);
  });

  // insert state array into gameData object
  gameData = { state: state };

  if (currentGame) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentGame}`,
      data: gameData
    });
  } else {
    $.post('/games', gameData, function(game) {
      currentGame = game.data.id;
      $('#games').append(`<button id="gameid-${game.data.id}">${game.data.id}</button><br>`);
      $("#gameid-" + game.data.id).on('click', () => reloadGame(game.data.id));
    });
  }
}

function showPreviousGames() {
  $('#games').empty(); // clear the #games div
  // grab the games json and buttonize each game if there are any
  $.get('/games', (savedGames) => {
    if (savedGames.data.length) {
      savedGames.data.forEach(buttonizePreviousGame);
    }
  });
}

function buttonizePreviousGame(game) {
  // for the passed-in game, add button for it to #games and set a listener on it
  $('#games').append(`<button id="gameid-${game.id}">${game.id}</button><br>`);
  $(`#gameid-${game.id}`).on('click', () => reloadGame(game.id));
}

function resetBoard() {
  turn = 0;
  currentGame = 0;
  $('td').text('');
}

// yeah, had to modernize that creaky old XMLHttpRequest, much cleaner!
function reloadGame(gameID) {
  document.getElementById('message').innerHTML = '';

  $.getJSON(`/games/${gameID}`, function(data){
    const id = data.data.id;
    const state = data.data.attributes.state;

    let index = 0;
    // ugh. why x/y. why not simply 0-8?
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        document.querySelector(`[data-x="${x}"][data-y="${y}"]`).innerHTML = state[index];
        index++;
      }
    }

    turn = state.join('').length;
    currentGame = id;

    if (!checkWinner() && turn === 9) {
      setMessage('Tie game.');
    }
  });

}

// function reloadGame(gameID) {
//   document.getElementById('message').innerHTML = '';
//   const xhr = new XMLHttpRequest;
//   xhr.overrideMimeType('application/json');
//   xhr.open('GET', `/games/${gameID}`, true);
//   xhr.onload = () => {
//     const data = JSON.parse(xhr.responseText).data;
//     const id = data.id;
//     const state = data.attributes.state;
//     let index = 0;
//     for (let y = 0; y < 3; y++) {
//       for (let x = 0; x < 3; x++) {
//         document.querySelector(`[data-x="${x}"][data-y="${y}"]`).innerHTML = state[index];
//         index++;
//       }
//     }
//     turn = state.join('').length;
//     currentGame = id;
//     if (!checkWinner() && turn === 9) {
//       setMessage('Tie game.');
//     }
//   };
//   xhr.send(null);
// }

function attachListeners() {
  $('td').on('click', function() {
    // if the square is empty and there is no winner, invoke doTurn on this square
    if (!$.text(this) && !checkWinner()) {
      doTurn(this);
    }
  });

  $('#save').on('click', function() {
    saveGame();
    });
  $('#previous').on('click', function() {
    showPreviousGames();
  });
  $('#clear').on('click', function() {
    resetBoard();
  });
}