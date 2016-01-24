// make buttons text fit in buttons on mobile.
// make responsive when resizing window 
// download bootstrap and react
// add the three buttons in the nav bar
$(function() {


    var Board = React.createClass({
        getInitialState: function(){ 
            return {initialBoard: null, cellSelected: null, numSelected: null, currentBoard: null, finalBoard: null}
        },

        cellSelected: function(row, column){
            this.setState({cellSelected: [row, column]});
        },

        numberSelected: function(value){
            this.setState({numSelected: value});
        },

        newGame: function(){
            React.unmountComponentAtNode(sudoku);
            ReactDOM.render(
              <Board/>, document.getElementById('sudoku')
            );
        },

        hint: function(row, col, value){
            var currentBoard = this.state.currentBoard;
            currentBoard[row][col] = value;
            this.setState({currentBoard: currentBoard});
            var hintRow = this.state.displayBoard[row];
            this.refs['row'+row].flashRow(row, col);

        },
        componentWillMount: function(){
            $.get("/problem-generator.json", function(data){
                // check that the component is still mounted before updating its state
                if (this.isMounted()){
                    this.setState({initialBoard: JSON.parse(data)});
                    this.setState({currentBoard: JSON.parse(data)});

                    }
                }.bind(this));

            $.get("/solved-board.json", function(data){
                // check that the component is still mounted before updating its state
                if (this.isMounted()){
                    this.setState({finalBoard: JSON.parse(data)});

                    }
                }.bind(this));

            var displayBoard = [];
            this.setState({displayBoard: displayBoard});
        },

        update: function(value){
            if (this.state.cellSelected){
                var current = this.state.currentBoard;
                current[this.state.cellSelected[0]][this.state.cellSelected[1]] = value;
                console.log("row "+this.state.cellSelected[0]+" col "+this.state.cellSelected[1]+" value "+value )
                this.setState({currentBoard: current});
            }
        },

        clearBoard: function(){
            function copy(array) {
              return array.map(function(arr) {
                return arr.slice();
              });
            }

            var newCurrentBoard = copy(this.state.initialBoard);
            this.setState({currentBoard: newCurrentBoard});

        },

        check: function(){
            for (var row=0; row<9; row++){
                for (var col=0; col<9; col++){
                    if (this.state.currentBoard[row][col]!=this.state.finalBoard[row][col]){
                        return false;
                    }
                }
            }
            return true;
        },

        render: function(){
            var buttonDimension = ($("#sudoku").width()); 
            var style={width:buttonDimension};

            this.state.displayBoard = [];
            if (this.state.initialBoard !== null && this.state.currentBoard !== null){
                for (var row=0; row<9; row++){
                    var stringRow = "row"+row;
                    var localVar = (<Row ref={stringRow} update={this.update} row={row} innerValue={this.state.initialBoard[row]} value={this.state.currentBoard[row]} cellSelected={this.cellSelected}/>);
                    this.state.displayBoard.push(localVar);
                }

            }
            return (
                <div>
                    <div id='controls' style={style}>
                        <New newGame={this.newGame}/>
                        <Check checkBoard={this.check}/>
                        <Clear clearBoard={this.clearBoard} />
                        <Hint hint={this.hint} currentBoard={this.state.currentBoard} finalBoard={this.state.finalBoard}/>
                    </div>
                    <hr></hr>
                    <div id='table-div'>
                        <table><tbody>{this.state.displayBoard}</tbody></table>
                    </div>
                    <p id='instructions'>
                    Click a cell on the board.<br/>Then, click a number below to add it to the cell.
                    </p>
                    <div id='numbers'>
                        <Numbers numSelected={this.numberSelected} update={this.update}/>
                    </div>
                </div>
            );

        }
    });
    
    var Hint = React.createClass({
        hint: function(){
            var potentialHints = [];
            for (var row=0; row<9; row++){
                for (var col=0; col<9; col++){
                    if (this.props.currentBoard[row][col]===" "){
                        potentialHints.push([row, col])
                    }
                }
            }
            var randomHintIndex = Math.floor(Math.random()* potentialHints.length);
            var hintRow = parseInt(potentialHints[randomHintIndex][0]);
            var hintCol = parseInt(potentialHints[randomHintIndex][1]);
            var value = this.props.finalBoard[hintRow][hintCol];
            this.props.hint(hintRow, hintCol, value);
        },
        render: function(){
            return <button className="control-button btn btn-default" onClick={this.hint} data-toggle="tooltip" data-placement="bottom" title="Click me, then watch the board to see your hint appear!">Hint</button>;
        }
    });
    
    var New = React.createClass({
        newGame: function(){
            this.props.newGame();
        },
        render: function(){
            return <button className="control-button btn btn-default" onClick={this.newGame}>New Game</button>
        }
    });

    var Clear = React.createClass({
        clearBoard: function(){
            this.props.clearBoard();
        },
        render: function(){
            return <button className="control-button btn btn-default" onClick={this.clearBoard}>Start Over</button>
        }
    });
    
    var Row = React.createClass({
        flashRow: function(rowFlash, colFlash){
            this.refs['cell'+colFlash].flashCell(rowFlash, colFlash);
        },

        render: function(){
            var displayRow= [];
            for (var col=0; col<9; col++){
                var stringCol = "cell"+col;
                displayRow.push(<Cell ref={stringCol} update={this.props.update} row={this.props.row} column={col} innerValue={this.props.innerValue[col]} value={this.props.value[col]} cellSelected={this.props.cellSelected}/>);
            }
            return (
                <tr>{displayRow}</tr>

            );

        }
    });

    var Check = React.createClass({

        check: function(){
            var won = this.props.checkBoard()
            if (won){
                $('#myModalWinning').modal('show');
            }else{
                $('#myModalLosing').modal('show');

            }

        },

        render: function(){
            return <button className="control-button btn-default btn" onClick={this.check}>Check Answer</button>;
        }
    });


    var Cell = React.createClass({

        getInitialState: function(){
            return {permanent: (isNaN(parseInt(this.props.value)) ? false : true), clicked: null, flash: false};
        },

        flashCell: function(row, col){
            this.setState({flash: true});
        },

        clickedCell: function(evt){
            // if (this.props.numSelected && this.state.permanent === false){
            // }
            if (this.state.permanent === false){
                this.setState({clicked: true});
                console.log("in clicked cell");
                $(".btn-board").removeClass("change-background");
                // $(evt.target).addClass("change-background");
                // this.setState({clicked: false});
                this.props.cellSelected(this.props.row, this.props.column);
            }
        },

        render: function(){
            var cellDimension = $("#sudoku").width()/13;
            var style={width:cellDimension, height:cellDimension, fontSize:cellDimension, padding:0, lineHeight:".75em" };
            if (this.state.permanent === true){
                style.fontWeight ="bold";
                style.pointerEvents = 'none';
            }else{
                style.color="grey";
            }
            var btnClass = classNames({
                "btn-board" : true,
                "cell-btn" : true,
                "btn-default" : true,
                "flash": this.state.flash,
                "change-background": this.state.clicked
            });
            return <td><button style={style} className={btnClass} onClick={this.clickedCell}>{isNaN(parseInt(this.props.value)) ? String.fromCharCode(20) : this.props.value}</button></td>
        }


    });

    var Numbers = React.createClass({

        changeNumber: function(evt){
            this.props.numSelected(evt.target.innerHTML);
            this.props.update(evt.target.innerHTML);
        },

        render: function(){
            var cellDimension = ($("#sudoku").width())/14;                  
            var style={width:cellDimension, padding:0, height:cellDimension, fontSize:cellDimension, lineHeight:".75em", marginTop:20};
            var btnClass = classNames({
                "numberButton": true,
                "btn-board" : true,
                "btn" : true,
                "btn-default" : true
            });

            return (
                <div>
                    <button className={btnClass} style={style} onClick={this.changeNumber}>{String.fromCharCode(20)}</button>
                    <button className={btnClass} style={style} onClick={this.changeNumber}>1</button>
                    <button className={btnClass} style={style} onClick={this.changeNumber}>2</button>
                    <button className={btnClass} style={style} onClick={this.changeNumber}>3</button>
                    <button className={btnClass} style={style} onClick={this.changeNumber}>4</button>
                    <button className={btnClass} style={style} onClick={this.changeNumber}>5</button>
                    <button className={btnClass} style={style} onClick={this.changeNumber}>6</button>
                    <button className={btnClass} style={style} onClick={this.changeNumber}>7</button>
                    <button className={btnClass} style={style} onClick={this.changeNumber}>8</button>
                    <button className={btnClass} style={style} onClick={this.changeNumber}>9</button>
                </div>
            );

        }
    });

    ReactDOM.render(
      <Board/>,
      document.getElementById('sudoku')
    );
});