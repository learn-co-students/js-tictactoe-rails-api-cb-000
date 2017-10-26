var turn = 0
var saved = false
var current_game = 0
const WIN_COMBINATIONS = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
]

window.onload = () => {
  attachListeners()
}

function attachListeners() {
  document.getElementById('save').addEventListener("click", handleClickSave)
  document.getElementById('previous').addEventListener("click", handleClickPrevious)
  document.getElementById('clear').addEventListener("click", handleClickClear)
  // document.querySelectorAll('td').forEach(e => e.addEventListener("click", doTurn))
  $('td').on('click', function() {
    if (!$.text(this) && !checkWinner()) {
      doTurn(this);
    }
  });
}

function handleClickSave() {
  if(current_game === 0) {
    var values = []
    document.querySelectorAll('td').forEach((e, index) => { values[index] = e.innerHTML })
    var posting = $.post("/games", {state: values})
    posting.done(function(game) {
      current_game = game.data.id
    })
  } else {
    var values = []
    document.querySelectorAll('td').forEach((e, index) => { values[index] = e.innerHTML })
    $.ajax({
      url: `/games/${current_game}`,
      type: 'PATCH',
      data: {state: values},
      success: function(game) {
        console.log(game);
      }
    })
  }
}

function handleClickPrevious() {
  document.getElementById('games').innerHTML = ''
  $.get("/games", function(previousGames) {
    if (previousGames.data.length) {
      addGameButtons(previousGames.data)
    }
  })
}

function addGameButtons(games) {
  const gamesDiv = document.getElementById('games')
  games.forEach((game) => {
    var btn = document.createElement("BUTTON")
    btn.id = `gameid-${game.id}`
    btn.innerHTML = game.id
    gamesDiv.appendChild(btn)
    document.getElementById(`gameid-${game.id}`).addEventListener("click", handleClickReload)
  })
}

function handleClickClear() {
  resetGame()
}

function handleClickReload(element) {
  const game_id = element.target.innerHTML
  $.get(`/games/${game_id}`, function(game) {
    const board = game.data.attributes.state
    current_game = game.data.id
    turn = board.join('').length
    document.querySelectorAll('td').forEach((e, index) => { e.innerHTML = board[index] })
  })
}

function doTurn(element) {
  updateState(element)
  turn++
  if (checkWinner()) {
    handleClickSave()
    resetGame()
  } else if (draw()) {
    handleClickSave()
    setMessage('Tie game.')
    resetGame()
  }
}

function player() {
  var token = (turn % 2 === 0) ? "X" : "O"
  return token
}

function updateState(target) {
  const token = player()
  target.innerHTML = token
}

function draw() {
  return turn === 9
}

function resetGame() {
  document.querySelectorAll('td').forEach((e) => { e.innerHTML = "" })
  turn = 0
  current_game = 0
}

function setMessage(message) {
  document.getElementById('message').innerHTML = message
}

function checkWinner() {
  var board = []
  var winner = false

  document.querySelectorAll('td').forEach((e, index) => { board[index] = e.innerHTML })

  WIN_COMBINATIONS.some(function(combo) {
    if(board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      setMessage(`Player ${board[combo[0]]} Won!`)
      return winner = true
    }
  })
  return winner
}
