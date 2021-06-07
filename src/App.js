import {useState} from "react";
import './App.css';
import Board from './component/board';
import calculateWinner from "./utils/calculateWinner";
function App() {

// fill default value to 0 for our tic tac toe square
  // this will collect all boards that clicker per user
  // e.g index 0 which is default [null,null,null,null,null,null,null,null,null]
  // e.g index 1 [X,null,null,null,null,null,null,null,null]
  // e.g index 2 [X,O,null,null,null,null,null,null,null]
  const [history, setHistory] = useState([
    {
      squares: Array(9).fill(null)
    }
  ]);

  // zero means no click yet. X is in turn
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXIsNext] =  useState(true);



  const  jumpTo = (step) => {
    setStepNumber(step);
    setXIsNext((step%2)===0);
  };


  const handleBoardClick = (index) => {
    const current = history[history.length - 1];
    // Duplicate square using slice.
    const cloneSquare = current.squares.slice();

    const newCloneSquare = {
      squares: cloneSquare
    };
    const newHistory = [
        ...history,
      newCloneSquare
    ];
    // if single item board already clicked reject for second click
    if(cloneSquare[index]) {
      return;
    }
    cloneSquare[index] =xIsNext? "X" : 'O';
    setXIsNext(!xIsNext);
    setStepNumber(stepNumber + 1);
    setHistory(newHistory);
  };

  const statusForNextPlayer =  xIsNext ? "X" : "O";
  const current = history[stepNumber];
  // Render button that collects from history.
  // e.g go to 1, go to 2, go to 3
  // which 1,2,3 indicated the length of history
  const moves = history.map((step,move) => {
    const desc = move ? 'Go to #' + move : 'Start the Game';
    return (
        <li key={move}>
          <button onClick={() => {
            jumpTo(move);
          }}>
            {desc}
          </button>
        </li>
    )
  })

  calculateWinner(current.squares);
  return (
    <div className="App">
      <h2 className={'title'}>Tic Tac Toe Game</h2>
      <Board
          squares={current.squares}
          onClick={handleBoardClick}
      />
      <h2 className={'title'}>
        Next Player is:  {statusForNextPlayer}
      </h2>
      <ul>
        {moves}
      </ul>
    </div>
  );
}

export default App;
