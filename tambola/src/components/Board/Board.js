import React, { useState, useEffect, useContext } from 'react';
import './board.css';
import io from 'socket.io-client';
import { GlobalContext } from '../../context/Provider';

var socket

function Board() {
  const { roomID, userID } = useContext(GlobalContext)
  const [numbers, setNumbers] = useState([]);
  const [lastNumber, setLastNumber] = useState(null);
  const board = [];
  const [calledNumbers, setCalledNumbers] = useState([]);

  // Create an array with numbers 1 to 90
  for (let i = 1; i <= 90; i++) {
    board.push(i);
  }

  const handleStartCall = () => {
    socket.emit('callNumbers', { userName: userID, room: roomID, timeInterval:5000 })
  }

  // Listen for updates to the numbers array from the server
  // useEffect(() => {
  //   // socket.on('numbers', (newNumbers) => {
  //   //   setNumbers(newNumbers);
  //   // });
  //   setNumbers([1, 10, 35, 49, 85])
  // }, []);
  // }, [socket]);

  useEffect(() => {
    socket = io.connect("http://localhost:5000")
    console.log("inside useEffect");
    socket.on('calledNumber', randomNumber => {
      console.log("inside socket",randomNumber);
    });
  })

  // useEffect(() => {
  //   if (numbers.length > 0) {
  //     setLastNumber(numbers[numbers.length - 1]);
  //   }
  // }, [numbers]);

  return (
    <div>
      <button onClick={handleStartCall}>Start Calling</button>
      <div className="game-board">
        {board.map((number, index) => (
          <div
            key={number}
            className={`number ${numbers.includes(number) ? 'highlight' : ''} ${lastNumber === number ? 'popping' : ''}`}
          >
            {number}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Board;

