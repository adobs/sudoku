// can only clear board once, only sometimes it works
// can't highlight the same number more than once
// break out modules

$(function() {

    var Board = React.createClass({
        getInitialState: function(){ 
            return {initialBoard: null, numberSelected: null, currentBoard: null, finalBoard: null}
        },

        numberSelected: function(number){
            this.setState({numberSelected: number});
        },
        newGame: function(){
            React.unmountComponentAtNode(sudoku);
            ReactDOM.render(
              <Board/>, document.getElementById('sudoku')
            );
        },
        highlight: function(){
           $(".cell-btn:contains("+this.state.numberSelected+")").addClass('flash');
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

        update: function(row, column, value){
            var current = this.state.currentBoard;
            current[row][column] = value;
            this.setState({currentBoard: current});
        },

        clearBoard: function(){
            this.setState({currentBoard: this.state.initialBoard});

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
            this.state.displayBoard = [];
            if (this.state.initialBoard !== null && this.state.currentBoard !== null){
                for (var row=0; row<9; row++){
                    var stringRow = "row"+row;
                    var localVar = (<Row ref={stringRow} update={this.update} row={row} innerValue={this.state.initialBoard[row]} value={this.state.currentBoard[row]} numSelected={this.state.numberSelected}/>);
                    this.state.displayBoard.push(localVar);
                }

            }
            return (
                <div>
                    <div>
                        <New newGame={this.newGame}/>
                    </div>
                    <div>
                        <Check checkBoard={this.check}/>
                    </div>
                    <div>
                        <Clear clearBoard={this.clearBoard} />
                        <Hint hint={this.hint} currentBoard={this.state.currentBoard} finalBoard={this.state.finalBoard}/>
                    </div>
                    <table><tbody>{this.state.displayBoard}</tbody></table>
                    <div>
                        <Numbers numSelected={this.numberSelected}/>
                    </div>
                        <Highlight highlight={this.highlight} />

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
            // Cell.flashCell();
            this.props.hint(hintRow, hintCol, value);
        },
        render: function(){
            return <button onClick={this.hint}>Hint</button>;
        }
    });
    
    var Highlight = React.createClass({
        highlight: function(){
            this.props.highlight();
        },
        render: function(){
            return <button onClick={this.highlight}>Highlight</button>
        }

    })

    var New = React.createClass({
        newGame: function(){
            this.props.newGame();
        },
        render: function(){
            return <button onClick={this.newGame}>New Game</button>
        }
    });

    var Clear = React.createClass({
        clearBoard: function(){
            this.props.clearBoard();
        },
        render: function(){
            return <button onClick={this.clearBoard}>Start Over</button>
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
                displayRow.push(<Cell ref={stringCol} update={this.props.update} row={this.props.row} column={col} innerValue={this.props.innerValue[col]} value={this.props.value[col]} numSelected={this.props.numSelected}/>);
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
                alert("YOU WON");
            }else{
                alert('not quite');
            }

        },
        
        render: function(){
            return <button onClick={this.check}>Check Answer</button>;
        }
    });


    var Cell = React.createClass({

        getInitialState: function(){
            return {permanent: (this.props.value == 0 ? false : true), flash: false};
        },

        flashCell: function(row, col){
            this.setState({flash: true})
        },

        clickedCell: function(evt){
            if (this.props.numSelected && this.state.permanent === false){
                evt.target.innerHTML = this.props.numSelected;
                this.props.update(this.props.row, this.props.column, this.props.numSelected);
            }
        },

        render: function(){
            var cellDimension = ($(window).height()-200)/10;
            var style={width:cellDimension, height:cellDimension, fontSize:cellDimension, lineHeight:".75em" };
            if (this.state.permanent === true){
                style.fontWeight ="bold";
            }else{
                style.color="grey";
            }
            if (this.state.flash!==null && this.props.row === this.state.flash[0] && this.props.column ===this.state.flash[1]){
                console.log('should have flashed');
                style.addClass = "flash";
            }
            return <td><button style={style} className={this.state.flash ? "btn-board cell-btn flash" : "btn-board cell-btn"} onClick={this.clickedCell}>{this.props.value}</button></td>
        }


    });

    var Numbers = React.createClass({
        changeNumber: function(evt){
            this.props.numSelected(evt.target.innerHTML);
            $(".numberButton").removeClass("change-background");
            $(evt.target).addClass("change-background");
        },

        render: function(){
            var cellDimension = ($(window).height()-200)/11;                  ;
            var style={width:cellDimension, height:cellDimension, fontSize:cellDimension, lineHeight:".75em", marginTop:20};
            return (
                <div>
                    <button className="numberButton btn-board" style={style} onClick={this.changeNumber}> </button>
                    <button className="numberButton btn-board" style={style} onClick={this.changeNumber}>1</button>
                    <button className="numberButton btn-board" style={style} onClick={this.changeNumber}>2</button>
                    <button className="numberButton btn-board" style={style} onClick={this.changeNumber}>3</button>
                    <button className="numberButton btn-board" style={style} onClick={this.changeNumber}>4</button>
                    <button className="numberButton btn-board" style={style} onClick={this.changeNumber}>5</button>
                    <button className="numberButton btn-board" style={style} onClick={this.changeNumber}>6</button>
                    <button className="numberButton btn-board" style={style} onClick={this.changeNumber}>7</button>
                    <button className="numberButton btn-board" style={style} onClick={this.changeNumber}>8</button>
                    <button className="numberButton btn-board" style={style} onClick={this.changeNumber}>9</button>
                </div>
            );

        }
    });

    ReactDOM.render(
      <Board/>,
      document.getElementById('sudoku')
    );
});