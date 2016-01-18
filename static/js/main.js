// // main.js
// var React = require('react');
// var ReactDOM = require('react-dom');
$(function() {

    function generateBoard(){
        var boardMatrix = [];
        var row=[];
        for (var i=0; i<9; i++){
            row.push(null);
        }
        for (var j=0; j < 9; j++){
            boardMatrix.push(row);
        }
        populateBoard(boardMatrix);
    }

    function populateBoard(board){

        function checkMove(value, row, col){
            for (var move=0; move<9; move++){
                if(board[row][move]===value){
                    return false;
                }
                if (board[move][col]===value){
                    return false;
                }
            }
            return true;

        }

        var availableMoves;
        var valueIndex;
        for (var row=0; row<9; row++){
            availableMoves = [1,2,3,4,5,6,7,8,9];
            for (var col=0; col<9; col++){
                console.log("board"+board);
                valueIndex = Math.floor(Math.random()* availableMoves.length);
                if (checkMove(valueIndex, row, col)){
                    board[row][col] = availableMoves[valueIndex];
                    availableMoves.splice(valueIndex, 1);
                }else{
                    col--;
                    if (col>=0){
                        var value = board[row][col];
                        board[row][col] = null;
                        availableMoves.push(value);
                        col--;
                    }else{
                        availableMoves = [1,2,3,4,5,6,7,8,9];
                        // clear the row
                        for (var k=0; k<9; k++){
                            board[row][k] = null;
                        }
                        row--;
                    }
                }

            }
        }
        console.log("BOARD IS"+ board);

    }

    var Board = React.createClass({
        render: function(){
            return (
                <div id='board'>
                    <div id='row1'>
                        <Block9/>
                        <Block9/>
                        <Block9/>
                    </div>
                    <div id='row2'>
                        <Block9/>
                        <Block9/>
                        <Block9/>
                    </div>
                    <div id='row3'>    
                        <Block9/>
                        <Block9/>
                        <Block9/>
                    </div>
                    <div>
                        <Numbers/>
                    </div>
                </div>
            );

        }
    });


    var Block9 = React.createClass({
        render: function(){
            return (
                <div id='block-9'>
                    <Cell/>
                    <Cell/>
                    <Cell/><br/>
                    <Cell/>
                    <Cell/>
                    <Cell/><br/>
                    <Cell/>
                    <Cell/>
                    <Cell/>
                </div>
            );
        }
    });

    var Cell = React.createClass({
        render: function(){
            return <button>1</button>;
        }
    });

    var Numbers = React.createClass({
        render: function(){
            return (
                <div>
                    <button>1</button>
                    <button>2</button>
                    <button>3</button>
                    <button>4</button>
                    <button>5</button>
                    <button>6</button>
                    <button>7</button>
                    <button>8</button>
                    <button>9</button>
                </div>
            );

        }
    });

    ReactDOM.render(
      <Board/>,
      document.getElementById('example')
    );
    generateBoard();
});