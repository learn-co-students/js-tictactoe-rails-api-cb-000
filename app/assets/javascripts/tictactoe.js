// Code your JavaScript / jQuery solution here

$(document).ready(function() {
  attachListeners();
});

var turn = 0;
var board = [];
var currentGame = 0;

function player() {
  if (turn % 2) {
    return "O";
  } else {
    return "X";
  }
}

function removeListeners() {
  var spaces = document.getElementsByTagName('td');
  for (let i = 0; i < 9; i++) {
    spaces[i].removeEventListener("click", function(e) {});
  }
}

function attachListeners() {
  var saveBtn = document.getElementById('save');
  saveBtn.addEventListener("click", function(event) {
    saveGame(currentGame);
  });
  var previousBtn = document.getElementById('previous');

  previousBtn.addEventListener("click", function(event) {
      $('#games').empty();
    $.get('/games', function(games) {
      let gamesDiv = document.getElementById('games');
      games.data.forEach(function(g) {
        gamesDiv.innerHTML += `<button onclick="loadGame(${g.id})" >Game :${g.id} </button>`
      });
    });
  });
  var clearBtn = document.getElementById('clear');
  clearBtn.addEventListener("click", function(event) {
    let board = ["", "", "", "", "", "", "", "", ""];
    fillBoard();
  });

  var spaces = document.getElementsByTagName('td');
  for (let i = 0; i < 9; i++) {
    spaces[i].addEventListener("click", function(e) {
      if (this.innerHTML === "") {
        doTurn(this);
      }
    });
  }
}


function saveGame(currentGame) {
   console.log(currentGame === 0);
   console.log(typeof currentGame + " " + currentGame);
  let gameBoard = {
    state: getBoard()
  }; //just make the object here

  if(currentGame){
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentGame}`,
      data: gameBoard
    });
  }else {
    let savedGame = $.post(`/games`, gameBoard)
    savedGame.done(function(response){ currentGame = parseInt(response.data.id) });

  }

  }



function loadGame(game) {
  let savedGame = $.ajax({
    url: `/games/${game}`,
    method: 'get'
  }).done(function(response) {


    currentGame = parseInt(response.data.id);
    fillBoard(response.data.attributes.state);

  });
}

function fillBoard(game = blankBoard()) {
  turn = game.join("").split("").length;
  let td = document.getElementsByTagName('td');
  for (let i = 0; i < 9; i++) {
    if (game[i] === undefined) {
      td[i].innerHTML = "";
    } else {
      td[i].innerHTML = game[i];
    }
  }

}

function doTurn(clickedSpace) {
  updateState(clickedSpace);
  turn++;

  if (checkWinner()) {
    saveGame();
    resetBoard();
  } else if (!getBoard().includes("")) {
    setMessage("Tie game.");
    saveGame();
    resetBoard();
  }
}

function updateState(position) {
  let token = player();
  position.innerHTML = token;
}

function setMessage(message) {
  let messageElement = document.getElementById('message');
  messageElement.innerHTML = message;
}

function checkWinner() {
  let board = getBoard();
  let winner = false;
  const WIN_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];


  WIN_COMBINATIONS.forEach(function(combo) {
    let index1 = combo[0];
    let index2 = combo[1];
    let index3 = combo[2];

    let pos1 = board[index1];
    let pos2 = board[index2];
    let pos3 = board[index3];

    if ((pos1 === "X" && pos2 === "X" && pos3 === "X") || (pos1 === "O" && pos2 === "O" && pos3 === "O")) {
      return winner = true;
    }
  });
  if (winner) {
    setMessage(`Player ${player()} Won!`);
    console.log(board + " " + turn + " " + player());
  }
  return winner;
}

function getBoard() {
  var board = [];
  var tdTags = document.getElementsByTagName('td');
  for (let i = 0; i < 9; i++) {
    if (tdTags[i].innerHTML !== "") {
      board.push(tdTags[i].innerHTML);
    } else {
      board.push("");
    }
  }
  return board;
}

function blankBoard() {
  return ["", "", "", "", "", "", "", "", ""];
}

function resetBoard() {
  board = blankBoard();
  fillBoard(board);
  
  currentGame = 0;
}
