$(function() {

    function generateBoard(){
        var boardMatrix = [];
        var row=[];
        for (var i=0; i<9; i++){
            row.push(null);
        }
        for (var j=0; j < 9; j++){
            boardMatrix.push([row]);
        }
        return [[4,7,9,6,5,2,1,3,8],[6,8,5,3,4,1,9,7,2],[3,1,2,8,9,7,6,4,5],[2,5,1,9,7,3,4,8,6],[8,9,3,1,6,4,2,5,7],[7,6,4,5,2,8,3,9,1],[5,2,8,4,3,6,7,1,9],[9,3,6,7,1,5,8,2,4],[1,4,7,2,8,9,5,6,3]]
        // return populateBoard(boardMatrix);
    }
// 
    // function populateBoard(board){
// 
        // var availableMoves;
        // var valueIndex;
        // for (var row=0; row<9; row++){
            // console.log("row is"+row);
            // availableMoves = [1,2,3,4,5,6,7,8,9];
            // for (var col=0; col<9; col++){
                // valueIndex = Math.floor(Math.random() * availableMoves.length);
                // if (checkMove(availableMoves[valueIndex], row, col)){
                    // board[row][col] = availableMoves[valueIndex];
                    // availableMoves.splice(valueIndex, 1);
                // }else{
                    // col--;
                    // var value = board[row][col];
                    // board[row][col] = null;
                    // availableMoves.push(value);
                    // if (col>0){
                        // col--;
                    // }else{
                        // row--;
                        // col=9;
                    // }
                    // 
                // }
// 
            // }
        // }
// 
        // function checkMove(value, row, col){
            // for (var move=0; move<9; move++){
                // check row
                // if(board[row][move]===value){
                    // return false;
                // }
                // check column
                // if (board[move][col]===value){
                    // return false;
                // }
            // }
            // check square
            // var row_square = Math.floor(row/3);
            // var col_square = Math.floor(col/3);
// 
            // for (var row_count=row_square*3; row_count<=row_square*3+2; row_count++){
                // for (var col_count=col_square*3; col_count<=col_square*3+2; col_count++){
                    // if(board[row_count][col_count]===value){
                        // console.log('square faliure');
                        // return false;
                    // }
                // }
            // }
            // return true;
// 
        // }
        // return board;
    // }
// 
    
    function pickPermanent(){
        var possibleOptions = []
        for (var k=0; k<9; k++){
            for (var j=0; j<9; j++){
                possibleOptions.push([k, j])
            }
        }
        var permanent = _.sample(possibleOptions, 20);
        console.log('permanent is'+permanent);
        return permanent;
    }

    var Board = React.createClass({
        getInitialState: function(){ 
            var layout = generateBoard();
            console.log('layout is'+layout);
            var permanentNumbers = pickPermanent()
            return {boardLayout: layout, numberSelected: null, permanent: permanentNumbers};
        },

        numberSelected: function(number){
            this.setState({numberSelected: number});
            console.log("number selected is"+this.state.numberSelected);
        },

        isPermanent: function(row, column){
            var permanentNumbers = this.state.permanent;
            if ($.inArray([row,column], permanentNumbers)===-1){
                return false;
            }
            return true;

        },

        render: function(){
            var num = this.state.numberSelected;
            var board = this.state.boardLayout;
            var permanent = pickPermanent();
            console.log('permie is '+ permanent)
            return ( 
                <div id='board'>
                    {this.state.boardLayout.map(function(row) {
                        return (
                          <div>
                            {row.map(function(col) {
                              return <Cell row={board.indexOf(row)} col={row.indexOf(col)} innerValue={col} value={col} numSelected={num}/>;
                            })}
                          </div>
                        );
                      })}
                    <div>
                        <Numbers numSelected={this.numberSelected}/>
                    </div>
                </div>
            );

        }
    });

    var Cell = React.createClass({
        clickedCell: function(evt){
            if (this.props.numSelected){
                // $(evt.target).attr("disabled",true);
                evt.target.innerHTML = this.props.numSelected;
                // $(evt.target).val(this.props.numberSelected);
            }
        },
        render: function(){
            console.log("row"+this.props.row);
            console.log("column"+this.props.col);
            return <button onClick={this.clickedCell}>{this.props.value}</button>
        }


    });

    var Numbers = React.createClass({
        changeNumber: function(evt){
            this.props.numSelected(evt.target.innerHTML);
        },
        render: function(){
            return (
                <div>
                    <button onClick={this.changeNumber}>1</button>
                    <button onClick={this.changeNumber}>2</button>
                    <button onClick={this.changeNumber}>3</button>
                    <button onClick={this.changeNumber}>4</button>
                    <button onClick={this.changeNumber}>5</button>
                    <button onClick={this.changeNumber}>6</button>
                    <button onClick={this.changeNumber}>7</button>
                    <button onClick={this.changeNumber}>8</button>
                    <button onClick={this.changeNumber}>9</button>
                </div>
            );

        }
    });

    ReactDOM.render(
      <Board/>,
      document.getElementById('sudoku')
    );
});