import React, { useState, useEffect } from 'react';
import './playerList.css';
import { GlobalContext } from '../../context/Provider';
import { useContext } from 'react';
import HowToPlay from '../HowToPlay/HowToPlay';

function PlayerList() {
  const [players, setPlayers] = useState([]);
  const { allUsers } = useContext(GlobalContext)

  // Listen for updates to the players array from the server
  useEffect(() => {
    let sortedArray = [...allUsers].sort((a, b) => b.score - a.score);
    setPlayers(sortedArray);
  }, [allUsers]);
  

  return (
    <div>
      {players.length &&
        <>
          <h2 style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>PLAYERS</h2>
          <table className="player-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Score</th>
                <th>Winning Category</th>
              </tr>
            </thead>
            <tbody>
              {players.length && players.map((player, index) => (
                <tr key={index}>
                  <td>{player.userName}</td>
                  <td>{player.score}</td>
                  <td>{player.scoreCategory.length && player.scoreCategory.map((item) => item.category).map((displayItem) => (
                    <p key={displayItem}>{displayItem}</p> 
                  ))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      }
      <HowToPlay />
    </div>
  );
}

export default PlayerList;
