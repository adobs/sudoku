$(function() {

    var Board = React.createClass({
        getInitialState: function(){ 
            return {boardLayout: 1, numberSelected: null};
        },

        numberSelected: function(number){
            this.setState({numberSelected: number});
            console.log("number selected is"+this.state.numberSelected);
        },

        componentDidMount: function(){
            $.get("/problem-generator.json", function(data){
                this.setState({boardLayout : JSON.parse(data).board});
            }.bind(this));
            console.log("hi");
            console.log("layout "+this.state.boardLayout);
        },

        render: function(){
            var num = this.state.numberSelected;
            var board = this.state.boardLayout;
            console.log("BOARD IS"+ board);
            var counter = 0;
            return (
                <div>
                    <div id='board'>
                    {this.state.boardLayout.map(function(val1) {
                        return (
                          <div id='board-row'>
                            {val1.map(function(val2) {
                                counter += 1;
                                return <Cell row={board.indexOf(val1)} id={counter} key={counter} col={val1.indexOf(val2)} innerValue={val2} permanent={permanent} value={val2} numSelected={num}/>;
                            })}
                          </div>
                        );
                      })}
                    </div>
                    <div>
                        <Numbers numSelected={this.numberSelected}/>
                    </div>
                // </div>
            );

        }
    });
    

    var Cell = React.createClass({
        getInitialState: function(){
            var row = this.props.row;
            var column = this.props.col;
            var value = this.showValue(row, column, this.props.innerValue);
            var permanentBoolean;
            if(value===0){
                permanentBoolean = false;
                }else{
                permanentBoolean = true;
            }
            return {permanent: permanentBoolean, value: value}

        },
        clickedCell: function(evt){
            if (this.props.numSelected && this.state.permanent === false){
                // $(evt.target).attr("disabled",true);
                evt.target.innerHTML = this.props.numSelected;
                // $(evt.target).val(this.props.numberSelected);
            }
        },


        render: function(){
         
            return <button onClick={this.clickedCell}>{this.state.value}</button>
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