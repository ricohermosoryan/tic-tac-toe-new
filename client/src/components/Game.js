import React, { useEffect, useState } from "react";
import axios from "../axiosConfig";
import { useParams, useNavigate } from "react-router-dom";

function Game() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [gameState, setGameState] = useState({
    player1: { name: "", wins: 0, losses: 0, draws: 0 },
    player2: { name: "", wins: 0, losses: 0, draws: 0 },
    rounds: [],
  });

  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayer1Turn, setIsPlayer1Turn] = useState(true);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const response = await axios.get(`/games/${id}`);
        const { player1, player2, status, rounds } = response.data;
        setGameState({ player1, player2, status, rounds });
      } catch (error) {
        console.error("Error fetching game data:", error);
      }
    };

    fetchGameData();
  }, [id]);

  const handleCellClick = (index) => {
    if (board[index] || gameState.status === "Complete") return;
    const newBoard = [...board];
    newBoard[index] = isPlayer1Turn ? "X" : "O";
    setBoard(newBoard);
    setIsPlayer1Turn(!isPlayer1Turn);

    const winner = calculateWinner(newBoard);
    if (winner) {
      handleWin(winner);
    } else if (newBoard.every((cell) => cell)) {
      handleDraw();
    }
  };

  const handleWin = (winnerSymbol) => {
    const winnerPlayer = winnerSymbol === "X" ? "player1" : "player2";
    const loserPlayer = winnerPlayer === "player1" ? "player2" : "player1";

    setGameState((prevState) => {
      const newRound = {
        winner: prevState[winnerPlayer].name,
        loser: prevState[loserPlayer].name,
        draw: false,
      };

      const updatedGameState = {
        ...prevState,
        rounds: [...prevState.rounds, newRound],
        [winnerPlayer]: {
          ...prevState[winnerPlayer],
          wins: prevState[winnerPlayer].wins + 1,
        },
        [loserPlayer]: {
          ...prevState[loserPlayer],
          losses: prevState[loserPlayer].losses + 1,
        },
      };

      return updatedGameState;
    });

    setWinner(gameState[winnerPlayer].name);
    setBoard(Array(9).fill(null));
    setIsPlayer1Turn(true);
  };

  const handleDraw = () => {
    const newRound = { winner: null, loser: null, draw: true };
    setGameState((prevState) => ({
      ...prevState,
      rounds: [...prevState.rounds, newRound],
      player1: { ...prevState.player1, draws: prevState.player1.draws + 1 },
      player2: { ...prevState.player2, draws: prevState.player2.draws + 1 },
    }));
    setBoard(Array(9).fill(null));
    setIsPlayer1Turn(true);
  };

  const updateGameSession = async () => {
    try {
      const success = await sendGameStateUpdate(gameState);
      if (success) {
        setGameState((prevState) => ({
          ...prevState,
          player1: { ...prevState.player1, wins: 0, losses: 0, draws: 0 },
          player2: { ...prevState.player2, wins: 0, losses: 0, draws: 0 },
          rounds: [],
        }));
        setBoard(Array(9).fill(null));
        setIsPlayer1Turn(true);
        console.log("Game session updated and new game started");
      } else {
        await axios.put(`/games/${id}`, gameState);

        setGameState((prevState) => ({
          ...prevState,
          player1: { ...prevState.player1, wins: 0, losses: 0, draws: 0 },
          player2: { ...prevState.player2, wins: 0, losses: 0, draws: 0 },
          rounds: [],
        }));
        setBoard(Array(9).fill(null));
        setIsPlayer1Turn(true);
        console.log("Game session updated via fallback and new game started");
      }
    } catch (error) {
      console.error("There was an error updating the game session:", error);
    }
  };

  async function endGame() {
    const updatedState = { ...gameState, status: "Complete" };
    console.log("Sending updated state to backend:", updatedState);

    const success = await sendGameStateUpdate(updatedState);
    if (success) {
      navigate("/");
    } else {
      // Handle failure (e.g., stay on page, show error)
    }
  }

  async function sendGameStateUpdate(updatedState) {
    try {
      const response = await axios.put(`/games/${id}`, updatedState);
      console.log("Game session updated:", response.data);
      return true;
    } catch (error) {
      console.error("There was an error updating the game session:", error);
      // Handle error (e.g., show error message to user)
      return false;
    }
  }

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }
    return null;
  };

  return (
    <div className="max-w-md mx-auto my-10 bg-white shadow-md overflow-hidden md:max-w-2xl">
      <div className="p-8">
        <h1 className="block w-full text-center text-grey-darkest mb-6">
          Game Session: {id}
        </h1>
        {winner && (
          <p className="text-center text-xl font-bold mb-4">{winner} wins!</p>
        )}
        <p className="text-center text-lg mb-4">
          Player 1: {gameState.player1.name} - Wins: {gameState.player1.wins},
          Losses: {gameState.player1.losses}, Draws: {gameState.player1.draws}
        </p>
        <p className="text-center text-lg mb-4">
          Player 2: {gameState.player2.name} - Wins: {gameState.player2.wins},
          Losses: {gameState.player2.losses}, Draws: {gameState.player2.draws}
        </p>
        <p className="text-center text-lg mb-4">
          Current Turn:{" "}
          {isPlayer1Turn ? gameState.player1.name : gameState.player2.name}
        </p>
        <div className="flex justify-center">
          <div className="grid grid-cols-3 mb-4 w-[192px]">
            {board.map((cell, index) => (
              <div
                key={index}
                className="w-16 h-16 flex items-center justify-center border border-gray-400 text-2xl cursor-pointer"
                onClick={() => handleCellClick(index)}
              >
                {cell}
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-around mt-4">
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={updateGameSession}
          >
            Reset Game
          </button>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={endGame}
          >
            Stop
          </button>
        </div>
      </div>
    </div>
  );
}

export default Game;
