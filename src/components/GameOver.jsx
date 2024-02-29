export default function GameOver({ winner, rematch }) {
  return (
    <div id="game-over">
      <h2>GAME OVER</h2>
      {winner && <p>{winner} wins!</p>}
      {!winner && <p>It's a draw!</p>}
      <p>
        <button onClick={rematch}>Rematch</button>
      </p>
    </div>
  );
}
