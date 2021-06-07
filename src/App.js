import React, { useState, useEffect } from "react";
import Board from "./components/board/Board";
import Historty from "./components/history/Historty";

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
    return boardSize;
};
const GetAllSuolutions = (boardSize) => {
    const solutions = [];
    const diagonal1 = [];
    const diagonal2 = [];

    for (var rowIndex = 0; rowIndex < boardSize; rowIndex++) {
        var rowSolution = [];
        var columnSolution = [];
        diagonal1.push(rowIndex * boardSize + rowIndex);
        diagonal2.push(rowIndex * boardSize + (boardSize - rowIndex - 1));
        const rowStart = rowIndex * boardSize;
        for (var columnIndex = 0; columnIndex < boardSize; columnIndex++) {
            rowSolution.push(rowStart + columnIndex);
            columnSolution.push(columnIndex * boardSize + rowIndex);
        }
        solutions.push(rowSolution);
        solutions.push(columnSolution);
        rowSolution = [];
        columnSolution = [];
    }

    solutions.push(diagonal1);
    solutions.push(diagonal2);

    return solutions;
};

const boardSize = getBoardSize();
const solutions = GetAllSuolutions(boardSize);
const numOfSquare = boardSize * boardSize;

const Game = () => {
    const initialSqauresArray = [];
    const [xIsNext, setXIsNext] = useState(true);
    const [squaresArray, setSquaresArray] = useState(initialSqauresArray);
    const [history, setHistory] = useState([]);
    const [winner, setWinner] = useState();
    const [numOfFilledSquares, setNumOfFilledSquares] = useState(0);

    const squareClickHandler = (squareNumber) => () => {
        if (squaresArray[squareNumber] || winner) return;
        setNumOfFilledSquares((prev) => prev + 1);
        const value = xIsNext ? "X" : "O";
        squaresArray[squareNumber] = { value: value, winner: "" };
        const newHistory = [...history];
        newHistory.push(
            `player ${xIsNext ? "X" : "O"} has played on square ${squareNumber}`
        );
        setHistory(newHistory);
        setXIsNext((prev) => !prev);
    };

    const whoWon = () => {
        for (
            var solutionIndex = 0;
            solutionIndex < solutions.length;
            solutionIndex++
        ) {
            const solution = solutions[solutionIndex];
            console.log(squaresArray[solution[0]]);
            var firstSquare = squaresArray[solution[0]];
            if (!firstSquare) continue;
            firstSquare = firstSquare.value;
            //eslint-disable-next-line no-loop-func
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
        setWinner();
        setHistory([]);
        setNumOfFilledSquares(0);
    };

    useEffect(() => {
        setWinner(whoWon());
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
            <Historty history={history} />
        </div>
    );
};

export default Game;
