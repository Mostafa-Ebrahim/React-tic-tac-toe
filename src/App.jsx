import { useState } from "react";

import Player from "./components/Player";
import GameBoard from "./components/GameBoard";
import GameOver from "./components/GameOver";
import Log from "./components/Log";

import { WINNING_COMBINATIONS, INITIAL_BOARD, PLAYERS } from "./gameBoard";

function deriveActivePlayer(gameTurns) {
  let currentPlayer = PLAYERS.symbols[0];

  if (gameTurns.length > 0 && gameTurns[0].player === PLAYERS.symbols[0]) {
    currentPlayer = PLAYERS.symbols[1];
  }
  return currentPlayer;
}

function deriveWinner(gameBoard, players) {
  let winner;
  for (const combination of WINNING_COMBINATIONS) {
    const firstSquareSymbol =
      gameBoard[combination[0].row][combination[0].column];
    const secondSquareSymbol =
      gameBoard[combination[1].row][combination[1].column];
    const thirdSquareSymbol =
      gameBoard[combination[2].row][combination[2].column];

    if (
      firstSquareSymbol &&
      firstSquareSymbol === secondSquareSymbol &&
      firstSquareSymbol === thirdSquareSymbol
    ) {
      winner = players[firstSquareSymbol];
      break;
    }
  }
  return winner;
}

function deriveGameBoard(gameTurns) {
  let gameBoard = [...INITIAL_BOARD.map((array) => [...array])];

  for (const turn of gameTurns) {
    const { player, square } = turn;
    const { row, col } = square;

    gameBoard[row][col] = player;
  }
  return gameBoard;
}

export default function App() {
  const [gameTurns, setGameTurns] = useState([]);
  const [players, setPlayers] = useState({
    [PLAYERS.symbols[0]]: PLAYERS.names[0],
    [PLAYERS.symbols[1]]: PLAYERS.names[1],
  });

  const activePlayer = deriveActivePlayer(gameTurns);
  const gameBoard = deriveGameBoard(gameTurns);
  const winner = deriveWinner(gameBoard, players);
  const hasDraw = gameTurns.length === 9 && !winner;

  function onSquareClick(rowIndex, colIndex) {
    setGameTurns((prevTurns) => {
      let currentPlayer = deriveActivePlayer(prevTurns);

      const updatedTurns = [
        { square: { row: rowIndex, col: colIndex }, player: currentPlayer },
        ...prevTurns,
      ];

      return updatedTurns;
    });
  }

  function handleNameChange(symbol, newName) {
    setPlayers((prevPlayers) => {
      return {
        ...prevPlayers,
        [symbol]: newName,
      };
    });
  }

  return (
    <main>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          <Player
            initialName={PLAYERS.names[0]}
            symbol={PLAYERS.symbols[0]}
            isActive={activePlayer === PLAYERS.symbols[0]}
            onChangeName={handleNameChange}
          />
          <Player
            initialName={PLAYERS.names[1]}
            symbol={PLAYERS.symbols[1]}
            isActive={activePlayer === PLAYERS.symbols[1]}
            onChangeName={handleNameChange}
          />
        </ol>
        {(winner || hasDraw) && (
          <GameOver winner={winner} rematch={() => setGameTurns([])} />
        )}
        <GameBoard onSquareClick={onSquareClick} gameBoard={gameBoard} />
      </div>
      <Log turns={gameTurns} />
    </main>
  );
}
