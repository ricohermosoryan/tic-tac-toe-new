import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Game from "./components/Game";
import Homepage from "./components/Homepage";
import NewGameSession from "./components/NewGameSession";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Homepage />} />
        <Route path="/new-game" element={<NewGameSession />} />
        <Route path="/game/:id" element={<Game />} />
      </Routes>
    </Router>
  );
};

export default App;
