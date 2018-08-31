$(function(){

  var turn  = 0;

  const win_combinations = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [6,4,2]
  ]

  function player() {
    let player = turn % 2 == 0 ? "X" : "O";
    return player;
  };

  function updateState() {



     let won = comb[0] === comb[1] && comb[0] === comb[2]

  };

  function setMessage(string) {
    $('div#message').html(string);
  };

  function checkWinner() {
    let winner;

    win_combinations.forEach(function (comb) {
      let val_1 = $(`[data-n='${comb[0]}']`).html();
      let val_2 = $(`[data-n='${comb[1]}']`).html();
      let val_3 = $(`[data-n='${comb[2]}']`).html();

      if ( val_1 !== "" && val_1 === val_2 && val_1 === val_3 ) {
        winner = val_1;
        return;
      }
    });

    if (winner !== undefined ) {
      winner === "X" ? setMessage('Player X Won!') : setMessage('Player O Won!');
      return true;
    } else {
      return false;
    }

  }; // checkWinner()


  function doTurn() {

  };

  function attachListeners() {

  };


});
