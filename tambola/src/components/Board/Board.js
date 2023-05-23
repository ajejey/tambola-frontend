import React, { useState, useEffect, useContext } from 'react';
import './board.css';
import { GlobalContext } from '../../context/Provider';
import { useSearchParams } from 'react-router-dom';

function Board() {
  const { roomID, userID, host, allCategoriesClaimed, socket } = useContext(GlobalContext)
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

  function numberToString(number) {
    const numberString = String(number);
    const numberWords = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];
    const specialNumberWords = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tensWords = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    let outputString = '';

    if (number > 0 && number < 10) {
      outputString = `Single Number ${numberString[0]}`;
      console.log(outputString);
      return outputString;
    }

    if (number == 10) {
      outputString = 'One Zero. Ten.';
      console.log(outputString);
      return outputString;
    }

    if (number > 10 && number < 20) {
      outputString = `${numberString[0]} ${numberString[1]}. ${specialNumberWords[number - 10]}.`;
      console.log(outputString);
      return outputString;
    }

    if (number % 10 === 0 && number >= 20 && number < 100) {
      outputString = `${numberString[0]} ${numberString[1]}. ${tensWords[Number(numberString[0])]}`;
      console.log(outputString);
      return outputString;
    }

    if (number > 20 && number < 100) {
      outputString = `${numberString[0]} ${numberString[1]}. ${tensWords[Number(numberString[0])]} ${Number(numberString[1])}`;
      console.log(outputString);
      return outputString;
    }
  }


  const handleVoiceNumberCall = (voiceNumber) => {
    const utterance = new SpeechSynthesisUtterance(numberToString(voiceNumber));

    // Get the available voices
    const voices = speechSynthesis.getVoices();
    // voices.forEach(voice => console.log(voice.name));


    // Set the desired voice
    utterance.voice = voices.find(voice => voice.name === 'Google UK English Female');

    // Speak the utterance
    speechSynthesis.speak(utterance);


  }

  useEffect(() => {
    if (calledNumbers.length > 0) {
      setLastNumber(calledNumbers[calledNumbers.length - 1]);
      handleVoiceNumberCall(calledNumbers[calledNumbers.length - 1])
    }
  }, [calledNumbers]);

  useEffect(() => {
    if (allCategoriesClaimed === false) {
      socket.on('calledNumber', randomNumber => {
        console.log("inside socket calledNumbers", randomNumber);
        setCalledNumbers(randomNumber);
      });
    }
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
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>Current Number: <strong>{lastNumber}</strong></div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "20px", marginRight: "2vw", marginBottom: "20px" }}>
          <div>Room name: {roomID}</div>
          <div>User name: {userID}</div>
        </div>
      </div>
      {(userID.length && host.length && userID === host) ?
        <div style={{ display: "flex", justifyContent: "space-between", marginRight: "2vw" }}>
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

