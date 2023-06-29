import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';

import CreateRoom from './components/CreateRoom/CreateRoom';
import Home from './components/Home/Home';
import JoinRoom from './components/JoinRoom/JoinRoom';
import GameRoom from './components/GameRoom/GameRoom';
import ReactGA from "react-ga4";


function App() {
  ReactGA.initialize("G-HRZVY37W6Q");
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-room" element={<CreateRoom />} />
        <Route path="/join-room" element={<JoinRoom />} />
        <Route path="/game-room" element={<GameRoom />} />
      </Routes>
    </div>
  );
}

export default App;
