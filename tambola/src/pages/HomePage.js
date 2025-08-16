import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import Ticket from '../components/Ticket';
import './HomePage.css';
import '../oldComponents/Background/background.css';
import '../oldComponents/GameRoom/GameRoom.css';
import Background from '../oldComponents/Background/Background';
import HowToPlay from '../oldComponents/HowToPlay/HowToPlay';
import Header from '../oldComponents/Header/Header';

const socket = io('https://tambola-backend-production.up.railway.app/' || 'http://localhost:3001');

const ComingSoonInfo = ({type}) => {
  return (
    <div className="ml-2 relative group">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
        {type} is coming soon
      </div>
    </div>
  )
}

const prizeOptions = [
  'Early Five',
  'Top Row',
  'Middle Row',
  'Bottom Row',
  'All Corners',
  'Full House',
];

const HomePage = ({ room, setRoom, playerName, setPlayerName, handleCreateRoom, handleJoinRoom, error, requestTickets }) => {
  const location = useLocation();
  const [view, setView] = useState('initial'); // 'initial', 'creating', 'joining'
  const [showTicketSelection, setShowTicketSelection] = useState(false);
  const [availableTickets, setAvailableTickets] = useState([]);
  const [actionType, setActionType] = useState(null); // 'create' or 'join'
  const [playerConfig, setPlayerConfig] = useState({
    autoStrike: false,
    autoClaim: false,
  });

  const [gameConfig, setGameConfig] = useState({
    claims: prizeOptions,
    callingInterval: 5000, // Default to 5 seconds
    autoCalling: true,
  });

  useEffect(() => {
    if (location.state && location.state.view) {
      setView(location.state.view);
    }
    const urlParams = new URLSearchParams(window.location.search);
    const roomCode = urlParams.get('room');
    if (roomCode) {
      setRoom(roomCode);
      setView('joining');
    }
  }, [location, setRoom]);

  const handleClaimToggle = (claim) => {
    setGameConfig(prev => ({
      ...prev,
      claims: prev.claims.includes(claim)
        ? prev.claims.filter(c => c !== claim)
        : [...prev.claims, claim],
    }));
  };

  const handleRequestTickets = (type) => {
    setActionType(type);
    requestTickets((response) => {
      if (response.error) {
        // Handle error, maybe show a notification
        console.error('Error requesting tickets:', response.error);
      } else {
        setAvailableTickets(response.tickets);
        setShowTicketSelection(true);
      }
    });
  };

  const handleTicketSelection = (index) => {
    const chosenTicket = availableTickets[index];
    if (actionType === 'create') {
      handleCreateRoom(gameConfig, chosenTicket, playerConfig);
    } else if (actionType === 'join') {
      handleJoinRoom(chosenTicket, playerConfig);
    }
    setShowTicketSelection(false);
  };

  let takenConditionsForSubtext = [];

  const getTicketSubtext = (ticket) => {
    const allNumbers = ticket.flat().filter(n => n !== null);
    const evenNumbers = allNumbers.filter(n => n % 2 === 0).length;
    const oddNumbers = allNumbers.length - evenNumbers;
    const lowNumbers = allNumbers.filter(n => n <= 30).length;
    const midNumbers = allNumbers.filter(n => n > 30 && n < 60).length;
    const highNumbers = allNumbers.filter(n => n >= 60).length;
    const luckyNumbers = allNumbers.filter(n => n === 7 || n === 13);
    const twinNumbers = allNumbers.filter(n => n % 11 === 0 && n > 0).length;

    const rowCounts = ticket.map(row => row.filter(n => n !== null).length);
    const isBalanced = rowCounts.every(count => count === 5);

    const cornerNumbers = [
      ticket[0][0],
      ticket[0][8],
      ticket[2][0],
      ticket[2][8]
    ].filter(n => n !== null);

    const conditions = [
      { check: () => luckyNumbers.length >= 1, text: "Feeling lucky? This ticket has a special charm." },
      { check: () => midNumbers >= 7, text: "A fan of the classics, this ticket is solid in the middle." },
      { check: () => highNumbers >= 7, text: "Plays the long game, waiting for the high numbers to drop." },
      { check: () => twinNumbers >= 2, text: "Double delight! This ticket is seeing double with twin numbers." },
      { check: () => evenNumbers > 10, text: "Feeling lucky with evens! This ticket is packed with them!" },
      { check: () => lowNumbers >= 7, text: "Loves the early game! Strong start with low numbers." },
      { check: () => oddNumbers > 7, text: "An odd favorite! This ticket is skewed towards odd numbers." },
      { check: () => isBalanced && cornerNumbers.length >= 3, text: "Balanced and corner-heavy. A strategic choice for the long game." },
      { check: () => rowCounts[0] === 5 && rowCounts[1] < 5, text: "Top-heavy! A bold choice for those aiming for the top row prize." },
      { check: () => rowCounts[2] === 5 && rowCounts[1] < 5, text: "Bottom-loaded! This ticket is ready for a bottom row victory." },
      { check: () => allNumbers.filter(n => n <= 10).length >= 3, text: "Early bird special! This ticket has a strong start with low numbers." },
      { check: () => allNumbers.filter(n => n >= 80).length >= 3, text: "Late bloomer! This ticket is banking on the final numbers." }
    ];

    // Try to find a condition that is satisfied and not already taken
    for (const condition of conditions) {
      if (condition.check() && !takenConditionsForSubtext.includes(condition.text)) {
        takenConditionsForSubtext.push(condition.text);
        return condition.text;
      }
    }

    // If all satisfied conditions are taken, find any satisfied condition
    for (const condition of conditions) {
      if (condition.check()) {
        return condition.text;
      }
    }

    // Default if no conditions are satisfied
    return "A classic, well-rounded ticket. You can't go wrong with this one.";
  };

  return (
    <div>
      <Background />
      <Header />
      {/* <header className="bg-white shadow-md">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-gray-900">Tambola Online</Link>
          <Link
            to="/public-rooms"
            className="bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            Play Now
          </Link>
        </nav>
      </header> */}

      <main>
        <section className="hero text-center pt-10">
          <div className="container mx-auto">
            <div className="tambola">
              <span>T</span>
              <span>a</span>
              <span>m</span>
              <span>b</span>
              <span>o</span>
              <span>l</span>
              <span>a</span>
            </div>
            {/* <p className="text-xl mb-8">Create your own game, invite friends, and have a blast!</p> */}
          </div>
        </section>

        <section id="play-section" className="pb-16">
          <div className="container mx-auto text-center">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg mx-auto">
              {/* <h2 className="text-3xl font-bold mb-6">Play Tambola</h2> */}

              {!showTicketSelection ? (
                <>
                  {view === 'initial' && (
                    <div className="flex flex-col space-y-6">
                      <div className="mb-4">
                        <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">Play Options</h3>

                        <div className="mb-6">
                          <h4 className="text-lg font-medium mb-3 text-center text-gray-700">Private Games</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white border-2 border-blue-500 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
                              <button onClick={() => setView('creating')} className="w-full p-6 text-center">
                                <div className="text-blue-600 text-xl mb-3">
                                  <i className="fas fa-plus-circle mb-2 block text-3xl"></i>
                                  Create Room
                                </div>
                                <p className="text-gray-600 text-sm">Host your own game with custom settings</p>
                              </button>
                            </div>

                            <div className="bg-white border-2 border-blue-500 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
                              <button onClick={() => setView('joining')} className="w-full p-6 text-center">
                                <div className="text-blue-600 text-xl mb-3">
                                  <i className="fas fa-sign-in-alt mb-2 block text-3xl"></i>
                                  Join Room
                                </div>
                                <p className="text-gray-600 text-sm">Enter a room code to join friends</p>
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4">
                          <h4 className="text-lg font-medium mb-3 text-center text-gray-700">Public Games</h4>
                          <div className="bg-blue-500 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
                            <Link to="/public-rooms" className="block p-6 text-center">
                              <div className="text-white text-xl mb-3">
                                <i className="fas fa-users mb-2 block text-3xl"></i>
                                Public Rooms
                              </div>
                              <p className="text-blue-100 text-sm">Join ongoing games with players worldwide</p>
                            </Link>
                          </div>
                        </div>
                      </div>

                      <div className="text-center text-gray-500 text-sm mt-2">
                        <p>Select an option to get started with your Tambola adventure!</p>
                      </div>
                    </div>
                  )}

                  {view === 'creating' && (
                    <div className="mt-8 text-left">
                      <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Game Configuration</h3>
                      {/* Game Config UI */}
                      <div className="mb-6">
                        <h4 className="font-medium text-gray-600 mb-3">Select Claims:</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {prizeOptions.map(claim => (
                            <label key={claim} className="flex items-center space-x-3 p-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">
                              <input
                                type="checkbox"
                                className="form-checkbox h-5 w-5 text-blue-600 rounded"
                                checked={gameConfig.claims.includes(claim)}
                                onChange={() => handleClaimToggle(claim)}
                              />
                              <span className="text-gray-800 font-medium">{claim}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className="bg-gray-100 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-800 mb-3">Number Calling</h4>
                        <div className="flex items-center justify-center bg-gray-200 rounded-full p-1">
                          <button
                            className={`w-1/2 py-2 text-sm font-medium rounded-full transition-colors ${gameConfig.autoCalling ? 'bg-blue-500 text-white shadow' : 'text-gray-600'}`}
                            onClick={() => setGameConfig(prev => ({ ...prev, autoCalling: true }))}
                          >
                            Auto
                          </button>
                          <button
                            className={`w-1/2 py-2 text-sm font-medium rounded-full transition-colors ${!gameConfig.autoCalling ? 'bg-blue-500 text-white shadow' : 'text-gray-600'}`}
                            onClick={() => setGameConfig(prev => ({ ...prev, autoCalling: false }))}
                          >
                            Manual
                          </button>
                        </div>
                        {gameConfig.autoCalling && (
                          <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Interval: {gameConfig.callingInterval / 1000}s
                            </label>
                            <input
                              type="range"
                              min="2"
                              max="10"
                              step="1"
                              className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-500"
                              value={gameConfig.callingInterval / 1000}
                              onChange={(e) => setGameConfig(prev => ({ ...prev, callingInterval: e.target.value * 1000 }))}
                            />
                          </div>
                        )}
                      </div>
                      <div className="mt-8 text-left">
                        <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Player Configuration</h3>
                        <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg">
                          <div className="flex items-center">
                            <h4 className="font-semibold text-gray-800">Number Strike</h4>
                            <ComingSoonInfo type="Auto Number Strike" />
                          </div>
                          <div className="flex items-center justify-center bg-gray-200 rounded-full p-1 min-w-[150px]">
                            <button
                              className={`w-1/2 py-2 px-3 text-sm font-medium rounded-full transition-colors ${!playerConfig.autoStrike ? 'bg-blue-500 text-white shadow' : 'text-gray-600'}`}
                              onClick={() => setPlayerConfig(prev => ({ ...prev, autoStrike: false }))}
                            >
                              Manual
                            </button>
                            <button
                              className={`w-1/2 py-2 px-3 text-sm font-medium rounded-full transition-colors ${playerConfig.autoStrike ? 'bg-blue-500 text-white shadow' : 'text-gray-600'}`}
                              onClick={() => setPlayerConfig(prev => ({ ...prev, autoStrike: true }))}
                              disabled
                              title="Auto strike coming soon"
                            >
                              Auto
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg mt-4">
                          <div className="flex items-center">
                            <h4 className="font-semibold text-gray-800">Prize Claim</h4>
                            <ComingSoonInfo type="Auto Prize Claim" />
                          </div>
                          <div className="flex items-center justify-center bg-gray-200 rounded-full p-1 min-w-[150px]">
                            <button
                              className={`w-1/2 py-2 px-3 text-sm font-medium rounded-full transition-colors ${!playerConfig.autoClaim ? 'bg-blue-500 text-white shadow' : 'text-gray-600'}`}
                              onClick={() => setPlayerConfig(prev => ({ ...prev, autoClaim: false }))}
                            >
                              Manual
                            </button>
                            <button
                              className={`w-1/2 py-2 px-3 text-sm font-medium rounded-full transition-colors ${playerConfig.autoClaim ? 'bg-blue-500 text-white shadow' : 'text-gray-600'}`}
                              onClick={() => setPlayerConfig(prev => ({ ...prev, autoClaim: true }))}
                              disabled
                              title="Auto claim coming soon"
                            >
                              Auto
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mt-8">
                        <button
                          className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-transform transform hover:scale-105"
                          onClick={() => handleRequestTickets('create')}
                        >
                          Confirm & Create
                        </button>
                        <button
                          className="w-full bg-gray-400 text-white py-3 rounded-lg font-semibold hover:bg-gray-500 transition-transform transform hover:scale-105"
                          onClick={() => setView('initial')}
                        >
                          Back
                        </button>
                      </div>
                    </div>
                  )}

                  {view === 'joining' && (
                    <div className="space-y-4 mt-8">
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow shadow-sm"
                        placeholder="Enter Room Code"
                        value={room}
                        onChange={(e) => setRoom(e.target.value)}
                      />
                          <div>
                        <label htmlFor="player-name" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                          Please enter the phone number you used for registration to claim winnings
                        </label>
                        <input
                          id="player-name"
                          type="text"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow shadow-sm"
                          placeholder="Enter your phone number"
                          value={playerName}
                          onChange={(e) => setPlayerName(e.target.value)}
                        />
                      </div>
                      <div className="mt-8 text-left">
                        <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Player Configuration</h3>
                        <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg">
                          <div className="flex items-center">
                            <h4 className="font-semibold text-gray-800">Number Strike</h4>
                            <ComingSoonInfo type="Auto Number Strike" />
                          </div>
                          <div className="flex items-center justify-center bg-gray-200 rounded-full p-1 min-w-[150px]">
                            <button
                              className={`w-1/2 py-2 px-3 text-sm font-medium rounded-full transition-colors ${!playerConfig.autoStrike ? 'bg-blue-500 text-white shadow' : 'text-gray-600'}`}
                              onClick={() => setPlayerConfig(prev => ({ ...prev, autoStrike: false }))}
                            >
                              Manual
                            </button>
                            <button
                              className={`w-1/2 py-2 px-3 text-sm font-medium rounded-full transition-colors ${playerConfig.autoStrike ? 'bg-blue-500 text-white shadow' : 'text-gray-600'}`}
                              onClick={() => setPlayerConfig(prev => ({ ...prev, autoStrike: true }))}
                              disabled
                              title="Auto strike coming soon"
                            >
                              Auto
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg mt-4">
                          <div className="flex items-center">
                            <h4 className="font-semibold text-gray-800">Prize Claim</h4>
                            <ComingSoonInfo type="Auto Prize Claim" />
                          </div>
                          <div className="flex items-center justify-center bg-gray-200 rounded-full p-1 min-w-[150px]">
                            <button
                              className={`w-1/2 py-2 px-3 text-sm font-medium rounded-full transition-colors ${!playerConfig.autoClaim ? 'bg-blue-500 text-white shadow' : 'text-gray-600'}`}
                              onClick={() => setPlayerConfig(prev => ({ ...prev, autoClaim: false }))}
                            >
                              Manual
                            </button>
                            <button
                              className={`w-1/2 py-2 px-3 text-sm font-medium rounded-full transition-colors ${playerConfig.autoClaim ? 'bg-blue-500 text-white shadow' : 'text-gray-600'}`}
                              onClick={() => setPlayerConfig(prev => ({ ...prev, autoClaim: true }))}
                              disabled
                              title="Auto claim coming soon"
                            >
                              Auto
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mt-8">
                        <button
                          className="w-full bg-gray-700 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-transform transform hover:scale-105"
                          onClick={() => handleRequestTickets('join')}
                        >
                          Join Room
                        </button>
                        <button
                          className="w-full bg-gray-400 text-white py-3 rounded-lg font-semibold hover:bg-gray-500 transition-transform transform hover:scale-105"
                          onClick={() => setView('initial')}
                        >
                          Back
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="ticket-selection-container">
                  <h3 className="text-2xl font-bold mb-4">Select Your Ticket</h3>
                  <p className="text-gray-600 mb-6">Choose one of the 5 generated tickets:</p>
                  <div className="grid grid-cols-1 gap-4">
                    {availableTickets.map((ticket, index) => (
                      <div key={index} className="border border-gray-300 rounded-lg p-4 shadow-sm">
                        <Ticket ticket={ticket} numbersCalled={[]} />
                        <p className="text-sm italic font-medium text-indigo-600 mt-2 px-2 py-1 bg-indigo-50 rounded-md">
                          ✨ {getTicketSubtext(ticket)}
                        </p>
                        <button
                          onClick={() => handleTicketSelection(index)}
                          className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                        >
                          Select this Ticket
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setShowTicketSelection(false)}
                    className="mt-6 bg-gray-400 text-white py-2 px-6 rounded-lg font-semibold hover:bg-gray-500 transition-colors"
                  >
                    Back to Room Setup
                  </button>
                </div>
              )}
              {error && <p className="text-red-500 mt-4 font-medium">{error}</p>}
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-bold mb-12">How to Play Tambola</h2>
            <div className="grid md:grid-cols-1 gap-6 text-left max-w-4xl mx-auto">
              <div className="p-6 bg-gray-50 rounded-lg shadow-sm">
                <h3 className="text-2xl font-semibold mb-3 text-blue-600">Objective:</h3>
                <p>The objective of Tambola is to mark off numbers on your ticket as they are called out, in order to achieve a specific pattern or combination.</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-lg shadow-sm">
                <h3 className="text-2xl font-semibold mb-3 text-blue-600">Tickets:</h3>
                <p>Each player will have a ticket with a grid of numbers on it. The numbers range from 1 to 90 and are arranged in a random order across the ticket.</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-lg shadow-sm">
                <h3 className="text-2xl font-semibold mb-3 text-blue-600">Number Calling:</h3>
                <p>A caller randomly selects numbers from 1 to 90 and announces them one by one. The players will mark off the numbers on their respective tickets if they appear.</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-lg shadow-sm">
                <h3 className="text-2xl font-semibold mb-3 text-blue-600">Patterns:</h3>
                <p>The game can have various patterns to achieve a win. Some common patterns include a full house (all numbers marked off), a top line (all numbers in the top row marked off), a middle line (all numbers in the middle row marked off), a bottom line (all numbers in the bottom row marked off), and many more.</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-lg shadow-sm">
                <h3 className="text-2xl font-semibold mb-3 text-blue-600">Winning:</h3>
                <p>The game continues until a player achieves the announced pattern. The first player to achieve the pattern must claim the win.</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-lg shadow-sm">
                <h3 className="text-2xl font-semibold mb-3 text-blue-600">Etiquette:</h3>
                <p>Please maintain fair play and follow the rules of the game. Avoid any form of cheating or tampering with the tickets. Show respect to other players and the caller.</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-lg shadow-sm">
                <h3 className="text-2xl font-semibold mb-3 text-blue-600">Enjoy the Game:</h3>
                <p>Tambola is a fun and exciting game of chance. Relax, have fun, and enjoy the thrill of marking off the numbers as you get closer to achieving the winning pattern.</p>
              </div>
            </div>
          </div>
        </section>


        <section className="py-12 text-white">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl text-gray-900 font-bold mb-12">Why Tambola Online?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 bg-gray-700 rounded-lg">
                <h3 className="text-2xl font-semibold mb-3">Host Controls</h3>
                <p>Customize your game with configurable prizes and number calling speeds.</p>
              </div>
              <div className="p-6 bg-gray-700 rounded-lg">
                <h3 className="text-2xl font-semibold mb-3">Real-time Fun</h3>
                <p>Enjoy a seamless, real-time multiplayer experience with friends and family.</p>
              </div>
              <div className="p-6 bg-gray-700 rounded-lg">
                <h3 className="text-2xl font-semibold mb-3">Play Anywhere</h3>
                <p>Join a game from your desktop or mobile device. All you need is a browser.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center">
            <div className="mt-6">
              <div className="flex flex-col md:flex-row gap-3 justify-center">
                <p className="text-gray-400">Created By</p>
                <a
                  className="text-blue-300 hover:text-blue-100 transition-colors"
                  href="https://www.linkedin.com/in/radhika-priyavardhini-0683871b5/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Radhika Priyavardhini
                </a>
                <span className="hidden md:inline text-gray-500 mx-2">|</span>
                <a
                  className="text-blue-300 hover:text-blue-100 transition-colors"
                  href="https://www.linkedin.com/in/ajey-nagarkatti-28273856/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Ajey Nagarkatti
                </a>
              </div>
            </div>
            <p className="text-lg mt-4">&copy; {new Date().getFullYear()} Tambola Online. All rights reserved.</p>
            <div className="flex gap-8 mt-4">
              <Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms-of-service" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link>
              <Link to="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;

