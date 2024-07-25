import React, { useState } from "react";
import axios from "../axiosConfig";
import { useNavigate } from "react-router-dom";

function NewGameSession() {
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("/games", {
        player1: player1,
        player2: player2,
      })
      .then((response) => {
        navigate(`/game/${response.data._id}`);
      })
      .catch((error) =>
        console.error("There was an error creating the game session:", error)
      );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto my-10 bg-white shadow-md overflow-hidden md:max-w-2xl"
    >
      <div className="p-8">
        <h1 className="block w-full text-center text-grey-darkest mb-6">
          Start New Game
        </h1>
        <label className="block mb-6">
          Player 1 Name:
          <input
            type="text"
            value={player1}
            onChange={(e) => setPlayer1(e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded w-full"
          />
        </label>
        <label className="block mb-6">
          Player 2 Name:
          <input
            type="text"
            value={player2}
            onChange={(e) => setPlayer2(e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded w-full"
          />
        </label>
        <button
          type="submit"
          className="block w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Start
        </button>
      </div>
    </form>
  );
}

export default NewGameSession;
