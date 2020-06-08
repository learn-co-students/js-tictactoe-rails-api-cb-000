// Code your JavaScript / jQuery solution here
$(document).ready(function() {
    attachListeners();
  });

function attachListeners() {

    $('td').on('click', function() {
      if (!$.text(this) && !checkWinner()) {
        doTurn(this);
      }
    });

    $('#clear').on('click', function() {
        clearBoard();
      });

    $('#previous').on('click', function() {
         previousGames();
    });

    $('#save').on('click', function() {
        saveGame(this);
    });

  }

var turn = 0;
let currentGame = 0;

const WINNING_GAMES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

function previousGames(){

    // remove list
    $( "#games").empty();
    // get reguest to index

    $.get( "/games", function( data ) {

        $("#games").on("click", "button", function(event){
            loadGame(this.id);
        });

        data.data.forEach(function(game){ 
           $('#games').append('<button type="button" id="' + game.id + '">' + game.id + '</button><br>');  
        });
      });

}

function loadGame(game){

    // save current game

    // change currentGame variable
    currentGame = parseInt(game);
    // remove message
    setMessage("")
    // load game data
    $.get( "/games/" + game, function( data ) {
    
        // update board
        let board = data.data.attributes.state;
        turn = board.filter(tile => tile != "").length;
        $("td").each(function(index){
            $( this ).text(board[index]);
        });
      
    });
}



function saveGame(){
    // send update via API to update state
    // state is an array, so need to turn board into array
    
    let state = [];
    $("td").each(function(){
        state.push($( this ).text());
    });

    // now 
    if(currentGame == 0){
    
        $.post('/games', {state: state}, function(data){
            currentGame = parseInt(data.data.id);
        });
        
    } else {
        $.ajax({
            type: 'PATCH',
            url: `/games/${currentGame}`,
            data: {state: state}
          });
    }

}

function player(){
    if(turn % 2 == 0){
        return "X";
    } else {
        return "O";
    }
}

function updateState(tile){
    
    
    var the_player = player();

    $(tile).text(the_player);
    
}

function setMessage(string){
    $('#message').text(string);
}


function playerTiles(tile){
    let tiles = [];
    $("td").each(function(index){
        if($( this ).text() == tile){
            tiles.push(index);
        }
    });
    return tiles;
}


function playerWon(tile){
    
    let tiles = playerTiles(tile);
    let winner = false;

    WINNING_GAMES.forEach(function(game){
        if(game.every((val) => tiles.includes(val)) == true){
            winner = true;
        }
    });

    return winner;

}


function checkWinner(){



    if(playerWon("X") == true){

        setMessage("Player X Won!");
        return true;

    } else if (playerWon("O") == true){
        
        setMessage("Player O Won!");
        return true;

    } else {

        return false;
    
    }

}

function tileTaken(tile){

    return $( tile ).text() != "";
}


function clearBoard(){
    $("td").each(function(index){
        $( this ).text("");
    });
    currentGame = 0;
    turn = 0;
}


function doTurn(tile){
       
    updateState(tile);
        
    if(checkWinner()){
        saveGame();
        clearBoard();
    } else if(turn === 8){
        setMessage("Tie game.")
        saveGame();
        clearBoard();
    } else {  
        turn++
    }
}