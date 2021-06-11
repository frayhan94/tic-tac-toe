import React, { useState, useEffect } from "react";
import Board from "./components/board/Board";
import History from "./components/history/Historty";

let globalBoardSize = null;

const getBoardSize = () => {
    var getSize = prompt(
        "Please enter game size (positive number)\ndefault is 3 (3x3 board)",
        3
    );
    var boardSize = parseInt(getSize);
    while (isNaN(boardSize)) {
        getSize = prompt("Wrong input\nPlease enter game size (positive number)");
        boardSize = parseInt(getSize);
    }
    globalBoardSize = boardSize;
    return boardSize;
};

const getMaximumSquareCrossed = () => {
    var getMaximum = prompt(
        `Please enter maximum square that crossed. minimum 2  - maximum ${globalBoardSize}`,
        3
    );
    var boardMaximum = parseInt(getMaximum);
    while (isNaN(boardMaximum) || boardMaximum < 2 || boardMaximum > globalBoardSize) {
        getMaximum = prompt(`Wrong input\nPlease input minimum 2  - maximum ${globalBoardSize}`);
        boardMaximum = parseInt(getMaximum);
    }
    return boardMaximum;
};

/**
 * Example of returned array solution
 * we extract each solution
 * const [a,b,c] = solution[i];
 * above case all number inside a is = [0,3,6,0,1,2,0,2]
 * above case all number inside b is = [1,4,7,3,4,5,4,4]
 * above case all number inside c is = [2,5,8,6,7,8,8,6]
 *
 * Then we have our square like this
 * ["X","X","X", "","",""]
 * Above  has solution on first index which is [0,1,2]. the first index of solution
 *
 * So it will  be correct
 * squares[a] && squares[b] && squares[c]
 *
 *
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
*/

const GetAllSolution = (boardSize) => {
    const solutions = [];
    const diagonal1 = [];
    const diagonal2 = [];

    for (var rowIndex = 0; rowIndex < boardSize; rowIndex++) {
        console.log('indeks ke',rowIndex);
        console.log('diagonal1 storage start',diagonal1);
        console.log('diagonal2 storage start',diagonal2);
        var rowSolution = [];
        console.log('rowSolution storage start',rowSolution);
        var columnSolution = [];
        console.log('columnSolution storage start',columnSolution);
        console.log('diagonal1 outer push',rowIndex * boardSize + rowIndex);
        console.log('diagonal2 outer push',rowIndex * boardSize + (boardSize - rowIndex - 1));
        diagonal1.push(rowIndex * boardSize + rowIndex);
        diagonal2.push(rowIndex * boardSize + (boardSize - rowIndex - 1));
        const rowStart = rowIndex * boardSize;
        for (var columnIndex = 0; columnIndex < boardSize; columnIndex++) {
            console.log('rowSolution inner push value',rowStart + columnIndex);
            rowSolution.push(rowStart + columnIndex);
            console.log('columnSolution inner push value',columnIndex * boardSize + rowIndex);
            columnSolution.push(columnIndex * boardSize + rowIndex);
        }
        console.log('final rowSolution',rowSolution);
        console.log('final columnSolution',columnSolution);
        solutions.push(rowSolution);
        solutions.push(columnSolution);
        rowSolution = [];
        columnSolution = [];
        console.log('clear rowSolution',columnSolution);
        console.log('clear columnSolution',columnSolution);
    }

    console.log('final diagonal1',diagonal1);
    console.log('final diagonal2',diagonal2);
    solutions.push(diagonal1);
    solutions.push(diagonal2);
    console.log('final solutions result',solutions);

    return solutions;
};

const boardSize = getBoardSize();
const boardMaximum = getMaximumSquareCrossed();
const solutions = GetAllSolution(boardMaximum);
console.log('GetAllSolution',solutions);

const numOfSquare = boardSize * boardSize;

const Game = () => {

    /**
     * State to reset the squares array. always []
     *
     */
    const initialSqauresArray = [];

    /**
     * Determine which is in turn. X or O. Default is X
     *
     */
    const [xIsNext, setXIsNext] = useState(true);


    /**
     * Will have this example value
     * [
     *  {
     *      value: "X",
     *      winner: ""
     *  },
     *  {
     *      value: "O",
     *      winner: ""
     *  },
     * ]
     *
     */
    const [squaresArray, setSquaresArray] = useState(initialSqauresArray);
    const [arraySquareSelection, setArraySquareSelection] = useState([]);

    /**
     * Will save all of our step. in combination of X and O
     *
     */
    const [history, setHistory] = useState([]);
    /**
     *
    */
    const [winner, setWinner] = useState();
    /**
     * State to detect the step that has been done. default is 0 means no step before
     * Will change every time we click the square
    */
    const [numOfFilledSquares, setNumOfFilledSquares] = useState(0);
    /**
     * Handle onclick event on each square
     *
     */
    const squareClickHandler = (squareNumber) => () => {
        // prevent double click on same square. if winner found then breaks.
        // default squares array length is zero.
        if (squaresArray[squareNumber] || winner) return;
        // Add the step by counter 1
        setNumOfFilledSquares((prev) => prev + 1);
        // Determine if its x or o that in turn
        const value = xIsNext ? "X" : "O";

        // Fill the squaresArray by index. eg value can be
        /**
         * [
         *  {
         *      value: "X",
         *      winner: ""
         *  },
         *  {
         *      value: "O",
         *      winner: ""
         *  },
         * ]
         *
         */
        /**
         * The index can be random e.g
         * [0,1,2]
         * [0,1,6]
         */
        console.log('squaresArray click handler',squaresArray);
        console.log('squareNumber click handler',squareNumber);
        squaresArray[squareNumber] = { value: value, winner: "" };
        arraySquareSelection[squareNumber] = value;
        // Clone previous history
        const newHistory = [...history];
        // Push new one
        newHistory.push(
            `player ${xIsNext ? "X" : "O"} has played on square ${squareNumber}`
        );
        // Set to new history
        setHistory(newHistory);
        // Change the turn
        setXIsNext((prev) => !prev);
    };

    const whoWon = () => {

        // Loop through each solution.
        /**
         * e.g solution
         *
         * [
         *  [
         *     0,1,2
         *  ],
         *  [
         *     0,3,6
         *  ],
         *
         * ]
         */

        for (
            var solutionIndex = 0;
            solutionIndex < solutions.length;
            solutionIndex++
        ) {
            // take each single of solution. eg only take [ 0,1,2]
            const solution = solutions[solutionIndex];
            console.log('solutions single',solution);
            console.log('squaresArray',squaresArray);
            console.log('solution[0]',solution[0]);
            var firstSquare = squaresArray[solution[0]];
            console.log('firstSquare',firstSquare);
            // continue if first square does not have value
            if (!firstSquare) continue;
            firstSquare = firstSquare.value;
            console.log('firstSquare after value',firstSquare);
            //eslint-disable-next-line no-loop-func
            /**
             * Squares array consist of
             *
             *  [
             *      value:"X",
             *      winner: "X"
             *  ]
             *
             */

            if (
                solution.reduce(
                    (acc, squareIndex) =>
                        acc &&
                        squaresArray[squareIndex] &&
                        firstSquare === squaresArray[squareIndex].value,
                    true
                )
            ) {
                solution.map(
                    (squareIndex) =>
                        (squaresArray[squareIndex] = {
                            ...squaresArray[squareIndex],
                            winner: "winner",
                        })
                );
                return firstSquare;
            }
        }
    };

    const resetHandler = () => {
        setXIsNext(true);
        setSquaresArray(initialSqauresArray);
        setArraySquareSelection([]);
        setWinner();
        setHistory([]);
        setNumOfFilledSquares(0);
    };

    useEffect(() => {
        const whoWonInit = whoWon();
        console.log('whoWonInit',whoWonInit);
        setWinner(whoWonInit);
    }, [xIsNext]);

    var titleText;
    if (winner) titleText = `${winner} has won the game`;
    else {
        if (numOfFilledSquares === numOfSquare) titleText = `Its a tie`;
        else titleText = `player ${xIsNext ? "X" : "O"} is next`;
    }
    return (
        <div className='game-area'>
            <h2>Tic Tac Toe</h2>
            <h3>{titleText}</h3>
            <Board
                boardSize={boardSize}
                squaresArray={squaresArray}
                squareClickHandler={squareClickHandler}
            />
            <button onClick={resetHandler} className='reset'>
                Reset
            </button>
            <History history={history} />
        </div>
    );
};

export default Game;
