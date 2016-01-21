// can only clear board once, only sometimes it works
// can't highlight the same number more than once

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
            console.log("this row"+row+"this col"+col+"this val"+value);
            var cell = (row * 9 + col * 9)+1
            console.log("cell is "+cell);
            $("td:nth-child("+cell+")").children()[0].addClass('flash');

        },

        componentWillMount: function(){
            $.get("/problem-generator.json", function(data){
                // check that the component is still mounted before updating its state
                if (this.isMounted()){
                    this.setState({initialBoard: JSON.parse(data)});
                    this.setState({currentBoard: JSON.parse(data)});
                    console.log("aaaaa"+JSON.parse(data))

                    }
                }.bind(this));

            $.get("/solved-board.json", function(data){
                // check that the component is still mounted before updating its state
                if (this.isMounted()){
                    this.setState({finalBoard: JSON.parse(data)});
                    console.log("line 49"+JSON.parse(data));

                    }
                }.bind(this));
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
            var displayBoard = [];
            if (this.state.initialBoard !== null && this.state.currentBoard !== null){
                for (var row=0; row<9; row++){
                    displayBoard.push(<Row update={this.update} row={row} innerValue={this.state.initialBoard[row]} value={this.state.currentBoard[row]} numSelected={this.state.numberSelected}/>);
                }
            }
            console.log("here"+this.state.finalBoard);
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
                    <table><tbody>{displayBoard}</tbody></table>
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
            console.log("currentboard"+this.props.currentBoard);
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
            console.log("lenght ="+this.props.finalBoard.length);
            console.log("lenthi[0]"+this.props.finalBoard[0].length);
            console.log("a final board"+this.props.finalBoard);
            var value = this.props.finalBoard[hintRow][hintCol];
            console.log("row 125 row "+hintRow+"col "+hintCol+"value "+value);
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

        render: function(){
            var displayRow= [];
            for (var col=0; col<9; col++){
                displayRow.push(<Cell update={this.props.update} row={this.props.row} column={col} innerValue={this.props.innerValue[col]} value={this.props.value[col]} numSelected={this.props.numSelected}/>);
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

        clickedCell: function(evt){
            console.log("clicked");
            console.log("this state perm"+this.state.permanent);
            console.log("this porps valu"+this.props.value);
            if (this.props.numSelected && this.state.permanent === false){
                console.log('change')
                evt.target.innerHTML = this.props.numSelected;
                this.props.update(this.props.row, this.props.column, this.props.numSelected);
            }
        },

        getInitialState: function(){
            return {permanent: (this.props.value == 0 ? false : true)}
        },

        render: function(){
            var cellDimension = ($(window).height()-200)/10;
            var style={width:cellDimension, height:cellDimension, fontSize:cellDimension, lineHeight:".75em" };
            if (this.state.permanent === true){
                style.fontWeight ="bold";
            }else{
                style.color="grey";
            }
            return <td><button style={style} className="btn-board cell-btn" onClick={this.clickedCell}>{this.props.value}</button></td>
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