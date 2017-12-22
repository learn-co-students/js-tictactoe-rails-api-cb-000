// Code your JavaScript / jQuery solution here

$(document).ready(function(){


 //checkWinner();
 attachListeners();
});



  var turn = 0;
  var board = [];
  var currentGame = '';
  function player(){
    if (turn % 2 === 0){
      return "X";
    }else{
      return "O";
    }
  }

  function removeListeners(){
    var spaces = document.getElementsByTagName('td');
     for(let i = 0; i < 9; i++){
       spaces[i].removeEventListener("click", function(e){

       });
     }

  }
function attachListeners(){

  //console.log(board);
  var saveBtn = document.getElementById('save');
  saveBtn.addEventListener("click", function(event){
         let gameBoard = {state: getBoard()};  //just make the object here

         if(currentGame){
           let savedGame = $.ajax({
             method: 'patch',
             url: `/games/${currentGame}`
           }).done(function(response){
             console.log(response);
           })
         }else{
           let savedGame = $.post('/games', gameBoard);
            savedGame.done(function(response){

              currentGame = response.data.id;
            });
         }

     });
  var previousBtn = document.getElementById('previous');
    previousBtn.addEventListener("click", function(event){

        $.get('/games', function(games){
            let gamesDiv = document.getElementById('games');
            games.data.forEach(function(g){
             gamesDiv.innerHTML += `<button onclick="loadGame(${g.id})" >Game :${g.id} </button>`
});
            });

    });
  var clearBtn = document.getElementById('clear');
   clearBtn.addEventListener("click", function(event){

      let board = ["","","","","","","","",""];
    //  let gameBoard = `{"state": "${board}"}`
      /*let saveGame = $.post('/games', JSON.parse(gameBoard));
      saveGame.done(function(response){
        fillBoard(response.data.attributes.state);
      });*/
      fillBoard();
   });

   var spaces = document.getElementsByTagName('td');
    for(let i = 0; i < 9; i++){
      spaces[i].addEventListener("click", function(e){

        if(this.innerHTML === ""){
          doTurn(this);
        }

      });
    }



}


function loadGame(game){

  let savedGame = $.get(`/games/${game}`, JSON.parse(game));
  savedGame.done(function(response){
    currentGame = response.data.id;
  fillBoard(response.data.attributes.state);

  });
}

function fillBoard(game = blankBoard()){

     let td = document.getElementsByTagName('td');
      for(let i = 0; i < 9; i++){
        if(game[i] === undefined){
          td[i].innerHTML = " ";
        }else{
          td[i].innerHTML = game[i];

        }
      }
}

function doTurn(clickedSpace){
//console.log(currentGame);
  updateState(clickedSpace);
  if(checkWinner()){

    removeListeners();
     board = blankBoard();
    fillBoard(board);
    turn = 0;
  }else{
      turn++;
  }
}
  function updateState(position){
    let token = player();
    position.innerHTML = token;
  }

  function setMessage(message){
    console.log("set message run: " + message);
    let messageElement = document.getElementById('message');
    messageElement.innerHTML = message;
  }

  function checkWinner(){
    let board = getBoard();



    let winner = false;
    const WIN_COMBINATIONS =  [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];


      WIN_COMBINATIONS.forEach(function(combo){
        let index1 = combo[0];
        let index2 = combo[1];
        let index3 = combo[2];

        let pos1 = board[index1];
        let pos2 = board[index2];
        let pos3 = board[index3];

        if((pos1 === "X" && pos2 === "X" && pos3 === "X") || (pos1 === "O" && pos2 === "O" && pos3 === "O")){

          return  winner = true;

        }

  });
   if(winner){

     setMessage(`Player ${player()} Won!`);
   }else if(!winner && !getBoard().includes("")) {
     console.log("tie");
     removeListeners();
     setMessage("Tie game.")
     board = blankBoard();
    fillBoard(board);
    turn = 0;
   }


    return winner;

  }

  function getBoard(){
    var board = [];
     var tdTags = document.getElementsByTagName('td');
     for(let i = 0; i < 9; i++){
      // console.log(tdTags[i]);
       if(tdTags[i].innerHTML !== ""){
         board.push(tdTags[i].innerHTML);
       }else{
         board.push("");
       }
     }

     return board;
  }

function blankBoard(){
  return ["","","","","","","","",""];
}
