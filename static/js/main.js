$(function() {


    var Board = React.createClass({
        getInitialState: function(){ 
            return {initialBoard: null, numberSelected: null, won: false, currentBoard: null}
        },

        numberSelected: function(number){
            this.setState({numberSelected: number});
        },

        componentWillMount: function(){
            $.get("/problem-generator.json", function(data){
                // check that the component is still mounted before updating its state
                if (this.isMounted()){
                    this.setState({initialBoard: JSON.parse(data)});
                    this.setState({currentBoard: JSON.parse(data)});

                    console.log("in compo"+JSON.parse(data).board);
                    console.log("in compo"+data);

                    }
                }.bind(this));
                
            console.log("hi");
            console.log("layout "+this.state.initialBoard);
        },

        update: function(row, column, value){
            var current = this.state.currentBoard;
            current[row][column] = value;
            this.setState({currentBoard: current});
        },

        Check: function(){
            $("/solved-board.json", function(data){
                if(JSON.parse(data)===this.state.currentBoard){
                    this.setState({won: true});
                }
            });

        },

        render: function(){
            var displayBoard = [];
            if (this.state.initialBoard !== null && this.state.currentBoard !== null){
                for (var row=0; row<9; row++){
                    displayBoard.push(<Row row={row} innerValue={this.state.initialBoard[row]} value={this.state.currentBoard[row]} numSelected={this.state.numberSelected}/>);
                }
            }
            return (
                <div>
                    <table><tbody>{displayBoard}</tbody></table>
                    <div>
                        <Numbers numSelected={this.numberSelected}/>
                    </div>
                    <div>
                        <Check checkBoard={this.check} won={this.state.won}/>
                    </div>

                </div>
            );

        }
    });
    
    var Row = React.createClass({

        render: function(){
            var displayRow= [];
            for (var col=0; col<9; col++){
                displayRow.push(<Cell row={this.props.row} col={col} innerValue={this.props.innerValue[col]} value={this.props.value[col]} numSelected={this.props.numSelected}/>);
            }
            return (
                <tr>{displayRow}</tr>

            );

        }
    });

    var Check = React.createClass({

        check: function(){
            this.props.checkBoard;
            if (this.props.won){
                alert("YOU WON");
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
                // $(evt.target).attr("disabled",true);
                evt.target.innerHTML = this.props.numSelected;
                // this.props.value = this.props.numSelected;
                // this.props.updateBoard(1,2,3);
                // this.props.updateBoard(this.props.row, this.props.column, this.props.numSelected);
                // $(evt.target).val(this.props.numberSelected);
            }
        },

        getInitialState: function(){
            return {permanent: (this.props.value == 0 ? false : true)}
        },

        render: function(){
         
            return <td><button onClick={this.clickedCell}>{this.props.value}</button></td>
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