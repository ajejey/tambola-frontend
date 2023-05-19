import React, { useState, useEffect } from 'react';
import './playerList.css';
import { GlobalContext } from '../../context/Provider';
import { useContext } from 'react';

function PlayerList() {
  const [players, setPlayers] = useState([]);
  const { allUsers } = useContext(GlobalContext)

  // Listen for updates to the players array from the server
  useEffect(() => {
  setPlayers(allUsers)
  }, [allUsers]);

  return (
    <div>
      <h2 style={{display: "flex", justifyContent: "center", marginBottom: "12px"}}>PLAYERS</h2>
      <table className="player-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {players.length && players.map((player, index) => (
            <tr key={index}>
              <td>{player.userName}</td>
              <td>{player.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PlayerList;
