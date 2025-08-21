import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Board from '../components/Board';
import Ticket from '../components/Ticket';
import TicketInfo from '../components/TicketInfo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeUp, faVolumeMute } from '@fortawesome/free-solid-svg-icons';
import './RoomPage.css';

const RoomPage = ({
  gameState,
  myPlayerId,
  handleStartGame,
  handleClaimPrize,
  handleLeaveGame,
  isGameOver,
  onUpdateInterval,
  onToggleAutoCalling,
  onManualCall,
}) => {
  const { roomName } = useParams();
  const [struckNumbers, setStruckNumbers] = useState([]);
  const [inviteLink, setInviteLink] = useState('');
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showStartGameConfirm, setShowStartGameConfirm] = useState(false);
  const [nextGameTime, setNextGameTime] = useState({ minutes: 0, seconds: 0 });
  const [isMuted, setIsMuted] = useState(false);
  const me = gameState?.players[myPlayerId];
  const isHost = myPlayerId === gameState?.host;
  const currentNumber = gameState?.numbersCalled[gameState.numbersCalled.length - 1];


  useEffect(() => {
    if (roomName) {
      setInviteLink(`${window.location.origin}?room=${roomName}`);
    }

    if (roomName === 'house') {
      const calculateNextGameTime = () => {
        const now = new Date();
        const minutes = now.getMinutes();
        const gameInterval = 30; // Game runs every 30 minutes
        const remainingMinutes = gameInterval - (minutes % gameInterval);
        const seconds = now.getSeconds();
        const remainingSeconds = 60 - seconds;

        let displayMinutes = remainingMinutes - 1;
        let displaySeconds = remainingSeconds;

        if (remainingSeconds === 60) {
          displayMinutes = remainingMinutes;
          displaySeconds = 0;
        }

        if (displayMinutes < 0) {
          displayMinutes = 0;
        }

        setNextGameTime({ minutes: displayMinutes, seconds: displaySeconds });
      };

      calculateNextGameTime();
      const timer = setInterval(calculateNextGameTime, 1000);

      return () => clearInterval(timer);
    }
  }, [roomName]);

  useEffect(() => {
    if (me?.config?.autoStrike) {
      const myTicketNumbers = me.ticket.flat().filter(n => n !== null);
      const calledNumbersOnMyTicket = gameState.numbersCalled.filter(n => myTicketNumbers.includes(n));
      setStruckNumbers(calledNumbersOnMyTicket);
    }
  }, [gameState?.numbersCalled, me?.config?.autoStrike, me?.ticket]);

  useEffect(() => {
    if (currentNumber && gameState?.gameStarted && !isMuted) {
      const synth = window.speechSynthesis;
      if (!synth) {
        console.error("Speech synthesis not supported");
        return;
      }

      // Cancel any previous speech
      synth.cancel();

      const getSpokenText = (number) => {
        if (number >= 1 && number <= 9) {
          return `single number ${number}`;
        }
        const numberStr = number.toString();
        const digits = numberStr.split('').join(' ');
        return `${digits}, ${number}`;
      };

      const spokenText = getSpokenText(currentNumber);
      const utterance = new SpeechSynthesisUtterance(spokenText);

      const voices = synth.getVoices();
      const femaleVoice = voices.find(voice => voice.name.toLowerCase().includes('female') && voice.lang.startsWith('en'));

      if (femaleVoice) {
        utterance.voice = femaleVoice;
      } else {
        const englishVoice = voices.find(voice => voice.lang.startsWith('en'));
        if (englishVoice) {
          utterance.voice = englishVoice;
        }
      }
      
      synth.speak(utterance);

      return () => {
        synth.cancel();
      };
    }
  }, [currentNumber, gameState?.gameStarted, isMuted]);

  const handleNumberClick = (number) => {
    if (me?.config?.autoStrike) return;

    if (!gameState.numbersCalled.includes(number)) {
      console.log("Cannot strike a number that has not been called.");
      return;
    }

    if (struckNumbers.includes(number)) {
      setStruckNumbers(struckNumbers.filter((n) => n !== number));
    } else {
      setStruckNumbers([...struckNumbers, number]);
    }
  };

  useEffect(() => {
    if (me?.config?.autoClaim && gameState.gameStarted) {
      const myTicketNumbers = me.ticket.flat().filter(n => n !== null);
      const calledNumbersOnMyTicket = gameState.numbersCalled.filter(n => myTicketNumbers.includes(n));

      for (const prize of gameState.config.claims) {
        if (!gameState.prizes[prize]) {
          let isClaimable = false;
          switch (prize) {
            case 'Early Five':
              if (calledNumbersOnMyTicket.length >= 5) isClaimable = true;
              break;
            case 'Top Row':
              if (me.ticket[0].filter(num => num && calledNumbersOnMyTicket.includes(num)).length === 5) isClaimable = true;
              break;
            case 'Middle Row':
              if (me.ticket[1].filter(num => num && calledNumbersOnMyTicket.includes(num)).length === 5) isClaimable = true;
              break;
            case 'Bottom Row':
              if (me.ticket[2].filter(num => num && calledNumbersOnMyTicket.includes(num)).length === 5) isClaimable = true;
              break;
            case 'All Corners':
              const firstRowNumbers = me.ticket[0].filter(n => n !== null);
              const lastRowNumbers = me.ticket[2].filter(n => n !== null);
              const corners = [
                firstRowNumbers[0],
                firstRowNumbers[firstRowNumbers.length - 1],
                lastRowNumbers[0],
                lastRowNumbers[lastRowNumbers.length - 1]
              ];
              if (corners.every(num => calledNumbersOnMyTicket.includes(num))) isClaimable = true;
              break;
            case 'Full House':
              const totalNumbersOnTicket = myTicketNumbers.length;
              if (calledNumbersOnMyTicket.length === totalNumbersOnTicket) isClaimable = true;
              break;
            default:
              break;
          }

          if (isClaimable) {
            handleClaimPrize(prize, null);
          }
        }
      }
    }
  }, [gameState, me, handleClaimPrize]);

  if (isGameOver) {
    // GameOver UI remains the same
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl text-center">
            <h2 className="text-4xl font-extrabold mb-6 text-gray-800">Game Over!</h2>
            <p className="text-xl text-gray-700 mb-8">Room: {roomName} is now closed.</p>
  
            {(() => {
              const playersArray = Object.values(gameState.players);
              const sortedPlayers = [...playersArray].sort((a, b) => b.score - a.score);
              const topScore = sortedPlayers.length > 0 ? sortedPlayers[0].score : 0;
              const winners = sortedPlayers.filter(p => p.score === topScore && p.score > 0);
  
              return (
                <div className="mb-8">
                  {winners.length > 0 ? (
                    <div className="mb-6">
                      <h3 className="text-3xl font-bold text-green-600 mb-2">Winner{winners.length > 1 ? 's' : ''}!</h3>
                      <p className="text-2xl font-semibold text-gray-800">
                        {winners.map(w => w.name).join(', ')} with {topScore} points!
                      </p>
                    </div>
                  ) : (
                    <p className="text-xl text-gray-600 mb-6">No winner this time!</p>
                  )}
  
                  <h3 className="text-2xl font-semibold mb-4 text-gray-800">Final Scores:</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                      <thead>
                        <tr className="bg-gray-100 border-b">
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Player</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedPlayers.map((player, index) => (
                          <tr key={player.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} border-b`}>
                            <td className="py-3 px-4 text-gray-800">{player.name}</td>
                            <td className="py-3 px-4 text-gray-800 font-semibold">{player.score}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })()}
  
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">Claimed Prizes:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {Object.entries(gameState.prizes).map(([prize, claimInfo]) => (
                <div key={prize} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200 text-left">
                  <p className="text-lg font-semibold text-gray-800 mb-1">{prize}</p>
                  <p className="text-gray-700">Claimed by: <span className="font-medium">{claimInfo.player}</span></p>
                  <p className="text-gray-700">Score: <span className="font-medium text-green-600">+{claimInfo.score}</span></p>
                </div>
              ))}
            </div>
  
            <button
              onClick={handleLeaveGame}
              className="bg-blue-500 text-white py-2 px-6 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
            >
              Return to Join Screen
            </button>
          </div>
        </div>
      )
  }

  if (!gameState) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 container mx-auto max-w-6xl">
      <header className="bg-white shadow-md rounded-lg p-4 mb-6 flex flex-col sm:flex-row items-center justify-between">
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold text-gray-800">Room: {roomName}</h1>
          <p className="text-gray-600">Your Name: {me?.name || 'Player'}</p>
          {roomName === 'house' && (
            <p className="text-red-500 font-semibold mt-2">
              {gameState.gameStarted ? 
                'Game in progress!' : 
                `Next game starts in: ${String(nextGameTime.minutes).padStart(2, '0')}:${String(nextGameTime.seconds).padStart(2, '0')}`
              }
            </p>
          )}
        </div>
        <button onClick={handleLeaveGame} className="mt-4 sm:mt-0 bg-red-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-600 transition-colors">
          Leave Game
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel */}
        <div className="space-y-6">
          <Board board={gameState.board} currentNumber={currentNumber} />
          <div className="bg-white rounded-lg p-4 shadow-md text-center">
            <div className="flex justify-center items-center mb-3">
              <h3 className="text-xl font-semibold">Last 5 Numbers Called</h3>
              <button onClick={() => setIsMuted(!isMuted)} className="ml-4 bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors">
                <FontAwesomeIcon icon={isMuted ? faVolumeMute : faVolumeUp} />
              </button>
            </div>
            <div className="flex justify-center items-center space-x-3">
              {gameState.numbersCalled.slice(-5).reverse().map((num, i) => (
                <span key={i} className="flex items-center justify-center h-16 w-16 rounded-full bg-yellow-400 text-2xl font-bold text-gray-800 shadow-inner">
                  {num}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="space-y-6">
          <Ticket
            ticket={me?.ticket}
            numbersCalled={gameState.numbersCalled}
            struckNumbers={struckNumbers}
            onNumberClick={me?.config?.autoStrike === false ? handleNumberClick : null}
          />
          
          {/* Host Controls */}
          {isHost && roomName !== 'house' && (
            <div className="bg-white rounded-lg p-4 shadow-md space-y-4">
              <h3 className="text-xl font-semibold">Host Controls</h3>
              {!gameState.gameStarted && (
                <>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      readOnly
                      value={inviteLink}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(inviteLink);
                        alert('Link copied to clipboard!');
                      }}
                      className="bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-600"
                    >
                      Copy
                    </button>
                  </div>
                  <button
                    onClick={() => setShowStartGameConfirm(true)}
                    className="w-full bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600"
                  >
                    Start Game
                  </button>
                </>
              )}
              <div className="bg-gray-100 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">Number Calling</h4>
                <div className="flex items-center justify-center bg-gray-200 rounded-full p-1">
                  <button
                    className={`w-1/2 py-2 text-sm font-medium rounded-full transition-colors ${gameState.config.autoCalling ? 'bg-blue-500 text-white shadow' : 'text-gray-600'}`}
                    onClick={() => onToggleAutoCalling(true)}
                  >
                    Auto
                  </button>
                  <button
                    className={`w-1/2 py-2 text-sm font-medium rounded-full transition-colors ${!gameState.config.autoCalling ? 'bg-blue-500 text-white shadow' : 'text-gray-600'}`}
                    onClick={() => onToggleAutoCalling(false)}
                  >
                    Manual
                  </button>
                </div>
                {gameState.config.autoCalling && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Interval: {gameState.config.callingInterval / 1000}s
                    </label>
                    <input
                      type="range"
                      min="2" 
                      max="10"
                      step="1"
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      value={gameState.config.callingInterval / 1000}
                      onChange={(e) => onUpdateInterval(e.target.value * 1000)}
                    />
                  </div>
                )}
              </div>
              {!gameState.config.autoCalling && (
                <button
                  onClick={onManualCall}
                  className="w-full bg-purple-500 text-white py-2 rounded-lg font-semibold hover:bg-purple-600"
                >
                  Call Next Number
                </button>
              )}
            </div>
          )}

          {/* Player Actions */}
          <div className="bg-white rounded-lg p-4 shadow-md space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold">Claim here</h3>
                <p className="text-md text-blue-700 mt-1"><strong>Click the corresponding prize button when you have the pattern!</strong></p>
              </div>
              <button
                onClick={() => setShowInfoModal(true)}
                className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
                title="Show prize info"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {gameState.config.claims.map((prize) => (
                <button
                  key={prize}
                  onClick={() => handleClaimPrize(prize, me?.config?.autoStrike ? null : struckNumbers)}
                  disabled={gameState.prizes[prize] !== undefined}
                  className={`py-2 px-4 rounded-lg font-semibold transition-colors ${gameState.prizes[prize] !== undefined
                    ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {prize}
                </button>
              ))}
            </div>
          </div>

          {/* Game Info */}
          <div className="bg-white rounded-lg p-4 shadow-md space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3 border-b pb-2">Players</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.values(gameState.players).map((p) => (
                  <div key={p.id} className={`p-2 rounded-md ${p.disconnected ? 'bg-gray-100 text-gray-500' : 'bg-blue-50 text-blue-800'}`}>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-sm">Score: {p.score}</p>
                    {p.disconnected && <p className="text-xs italic">(Disconnected)</p>}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3 border-b pb-2">Prizes Claimed</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {gameState.prizes && Object.entries(gameState.prizes).map(([prize, claimInfo]) => (
                  <div key={prize} className="bg-green-50 p-2 rounded-md text-green-800">
                    <p className="font-medium">{prize}</p>
                    <p className="text-sm">by {claimInfo.player} (+{claimInfo.score})</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showInfoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-3xl max-h-full overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="text-2xl font-bold text-gray-800">Prize Information</h3>
              <button
                onClick={() => setShowInfoModal(false)}
                className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <TicketInfo />
          </div>
        </div>
      )}

      {showStartGameConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-md text-center">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">Start the Game?</h3>
            <p className="text-gray-600 mb-6 sm:mb-8">
              Once the game starts, new players will not be able to join this room. Please ensure all players are in before you begin.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowStartGameConfirm(false)}
                className="px-6 py-3 rounded-lg font-semibold bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleStartGame();
                  setShowStartGameConfirm(false);
                }}
                className="px-6 py-3 rounded-lg font-semibold bg-green-500 text-white hover:bg-green-600 transition-colors"
              >
                Confirm & Start
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomPage;
