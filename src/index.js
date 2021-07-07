import React from 'react';
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button'
import './index.css';

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        buttonNum: null,
        fillBtn: false
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i){
    const history = this.state.history.slice(0, this.state.stepNumber+1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]){
      return;
    }


    this.state.history.map( x => ( x.fillBtn=false) );
    
    squares[i]=this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([
        {
        squares: squares,
        buttonNum: i,
        fillBtn: true
        }
    ]),
      stepNumber:history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step){

    const history = this.state.history.slice(0, this.state.history.length);

    history[step].fillBtn=true;
    history[this.state.stepNumber].fillBtn=false;

    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      history:history,
    });
  }
  
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move +' -> ' + (((move % 2) === 0)?'O':'X')+'('+(parseInt(step.buttonNum/3)+1) +' ,'+ ((step.buttonNum%3)+1) +')':
        'Go to game start';
      return (
        <li key={move}>
          <Button variant={move===this.state.stepNumber?"contained":"outlined"} color="primary"  onClick={() => this.jumpTo(move)}>{desc}</Button>
        </li>
      );
    });

    let status;
    let fillBtn=Array(9).fill(false);
    if (winner) {
      status = 'Winner: ' + (this.state.xIsNext ? 'O':'X');
      winner.forEach(element => {
        fillBtn[element]=true;
      });
    
    }else if(this.state.stepNumber===9){
      status = 'Draw';
    }else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      this.state.history.map( x => (fillBtn[x.buttonNum]= x.fillBtn) );
      //console.log(fillBtn);
    }

  

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            fill={fillBtn}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

class Board extends React.Component {

  renderSquare(i){
    return (
      <Square 
        value={this.props.squares[i]}
        fillBtn={this.props.fill[i]}
        onClick={()=> this.props.onClick(i)}
        />
      );
  }

  render() {
    let boardSquares = [];
    for(let row = 0; row < 3; row++){
      let boardRow = [];
      for(let col = 0; col < 3; col++){
        boardRow.push(<span key={(row * 3) + col}>{this.renderSquare((row * 3) + col)}</span>);
      }
      boardSquares.push(<div className="board-row" key={row}>{boardRow}</div>);
    }

    return (
      <div>
        {boardSquares}
      </div>
    );
  }
}

function Square(props){
  return (
    <Button variant={props.fillBtn?"contained":"outlined"} color="primary"  className="square" onClick={props.onClick}>
      {props.value}
    </Button>
  );
}

function calculateWinner(squares){
  const lines=[
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for(let i = 0; i < lines.length; i++){
    const[a,b,c]=lines[i];
    if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
      return lines[i];
    }
  }
  return null;
}

/*
function calculateChanges(squaresOld,squaresNew){
  for(let i = 0; i < squaresOld.length; i++)
    if(squaresOld[i]!==squaresNew[i])
      return ((parseInt(i/3)+1) +' ,'+ ((i%3)+1));
  return;
}
*/

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);