import React, { useState, useEffect, useContext } from 'react';
import './board.css';
import { GlobalContext } from '../../context/Provider';
import { useSearchParams } from 'react-router-dom';

function Board() {
  const { roomID, userID, host, socket } = useContext(GlobalContext)
  let [searchParams, setSearchParams] = useSearchParams();
  const [lastNumber, setLastNumber] = useState(null);
  const [calledNumbers, setCalledNumbers] = useState([]);
  const [selectedChip, setSelectedChip] = useState('3000')
  const [disableSelections, setDisableSelections] = useState(false)
  const board = [];

  // Create an array with numbers 1 to 90
  for (let i = 1; i <= 90; i++) {
    board.push(i);
  }

  const handleChipClick = (chip) => {
    setSelectedChip(chip);
    setSearchParams({ ...Object.fromEntries([...searchParams]), selectedTime: chip })
  }

  const handleStartCall = () => {
    console.log("{ userName: userID, room: roomID, timeInterval:5000 }", { userName: userID, room: roomID, timeInterval: Number(selectedChip) })
    if (userID.length && roomID.length) {
      socket.emit('callNumbers', { userName: userID, room: roomID, timeInterval: Number(selectedChip) })
      setDisableSelections(true)
      setSearchParams({ ...Object.fromEntries([...searchParams]), disableCall: true })
    }
  }

  useEffect(() => {
    if (calledNumbers.length > 0) {
      setLastNumber(calledNumbers[calledNumbers.length - 1]);
    }
  }, [calledNumbers]);

  useEffect(() => {
    socket.on('calledNumber', randomNumber => {
      console.log("inside socket calledNumbers", randomNumber);
      setCalledNumbers(randomNumber);
    });
  }, [socket])

  useEffect(() => {
    if (Object.fromEntries([...searchParams]).selectedTime) {
      setSelectedChip(Object.fromEntries([...searchParams]).selectedTime)
    }
    if (Object.fromEntries([...searchParams]).disableCall) {
      setDisableSelections(Object.fromEntries([...searchParams]).disableCall)
    }
  }, [])

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginLeft: "5vw" }}>
        <div>Current Number: <strong>{lastNumber}</strong></div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "20px", marginRight: "5vw", marginBottom: "20px" }}>
          <div>Room name: {roomID}</div>
          <div>User name: {userID}</div>
        </div>
      </div>
      {(userID.length && host.length && userID === host) ?
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button className="start-call-button" onClick={handleStartCall} disabled={disableSelections}>Start Calling</button>
          <div className="chips">
            <button disabled={disableSelections} className={selectedChip === '3000' ? 'selected' : ''} onClick={() => handleChipClick('3000')}>3sec</button>
            <button disabled={disableSelections} className={selectedChip === '5000' ? 'selected' : ''} onClick={() => handleChipClick('5000')}>5sec</button>
            <button disabled={disableSelections} className={selectedChip === '7000' ? 'selected' : ''} onClick={() => handleChipClick('7000')}>7sec</button>
          </div>
        </div>
        : <br />
      }
      <div className="game-board">
        {board.map((number, index) => (
          <div
            key={number}
            className={`number ${calledNumbers.includes(number) ? 'highlight' : ''} ${lastNumber === number ? 'popping' : ''}`}
          >
            {number}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Board;

