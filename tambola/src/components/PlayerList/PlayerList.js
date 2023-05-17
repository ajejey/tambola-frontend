import React, { useState, useEffect } from 'react';
import './playerList.css';
// import io from 'socket.io-client';

// const socket = io('http://localhost:5000');

function PlayerList() {
  const [players, setPlayers] = useState([]);

  // Listen for updates to the players array from the server
  useEffect(() => {
    // socket.on('players', (newPlayers) => {
    //   setPlayers(newPlayers);
    // });
    setPlayers([{id: 1, name: "Ajey"}, {id: 2, name: "Radhika"}])
  }, []);

  return (
    <div className="player-list">
      <h2>Players</h2>
      <ul>
        {players.map((player) => (
          <li key={player.id}>{player.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default PlayerList;
