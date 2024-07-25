import React, { useEffect, useState } from "react";
import axios from "../axiosConfig";
import { Link } from "react-router-dom";

function Homepage() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    axios
      .get("/games")
      .then((response) => setGames(response.data))
      .catch((error) =>
        console.error("There was an error fetching the games:", error)
      );
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-center">
        <h1 className="text-3xl font-bold mb-6">Tic Tac Toe</h1>
      </div>
      <h1 className="text-3xl font-bold mb-6">Previous Games</h1>
      <ul className="space-y-4 mb-6">
        {games.map((game) => (
          <li key={game._id} className="p-4 bg-white shadow rounded">
            <div className="text-lg font-medium">
              {game.player1.name} (Wins: {game.player1.wins}, Losses:{" "}
              {game.player1.losses}, Draws: {game.player1.draws}) vs{" "}
              {game.player2.name} (Wins: {game.player2.wins}, Losses:{" "}
              {game.player2.losses}, Draws: {game.player2.draws})
            </div>
          </li>
        ))}
      </ul>
      <Link to="/new-game">
        <button className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-700">
          Start New Game
        </button>
      </Link>
    </div>
  );
}

export default Homepage;
