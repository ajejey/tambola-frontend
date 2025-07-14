import React, { useState, useEffect } from 'react';
import Ticket from '../components/Ticket';
import Header from '../oldComponents/Header/Header';

const PublicRoomsPage = ({ houseRoomState, joinHouseRoom, requestTickets }) => {
    const [timeDetails, setTimeDetails] = useState({
        gameStartsIn: { minutes: 0, seconds: 0 },
        joinClosesIn: { minutes: 0, seconds: 0 },
        nextGameStartTime: '',
        canJoin: false,
    });
    const [showTicketSelection, setShowTicketSelection] = useState(false);
    const [availableTickets, setAvailableTickets] = useState([]);
    const [playerName, setPlayerName] = useState('');
    const [playerConfig, setPlayerConfig] = useState({ autoStrike: false, autoClaim: false });

    useEffect(() => {
        const calculateTimeDetails = () => {
            const now = new Date();
            const minutes = now.getMinutes();
            const seconds = now.getSeconds();
            const gameInterval = 30; // Game runs every 30 minutes
            const joinWindowClosesMinutesBefore = 1; // Join window closes 1 minute before start

            const minutesIntoInterval = minutes % gameInterval;
            const minutesToGo = gameInterval - minutesIntoInterval;

            const gameStartsTotalSeconds = (minutesToGo * 60) - seconds;
            const gameStartsIn = {
                minutes: Math.floor(gameStartsTotalSeconds / 60),
                seconds: gameStartsTotalSeconds % 60,
            };

            const joinClosesTotalSeconds = gameStartsTotalSeconds - (joinWindowClosesMinutesBefore * 60);
            const joinClosesIn = {
                minutes: Math.floor(joinClosesTotalSeconds / 60),
                seconds: joinClosesTotalSeconds % 60,
            };

            const canJoin = joinClosesTotalSeconds > 0 && !houseRoomState.gameStarted;

            const nextGameTimestamp = new Date(now);
            nextGameTimestamp.setMinutes(now.getMinutes() + minutesToGo);
            nextGameTimestamp.setSeconds(0);
            nextGameTimestamp.setMilliseconds(0);
            const nextGameStartTime = nextGameTimestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            setTimeDetails({ gameStartsIn, joinClosesIn, nextGameStartTime, canJoin });
        };

        if (houseRoomState) {
            calculateTimeDetails();
            const timer = setInterval(calculateTimeDetails, 1000);
            return () => clearInterval(timer);
        }
    }, [houseRoomState]);

    const handleJoinClick = () => {
        if (!playerName.trim()) {
            alert('Please enter your name to join the game.');
            return;
        }
        requestTickets((response) => {
            if (response.error) {
                console.error('Error requesting tickets:', response.error);
            } else {
                setAvailableTickets(response.tickets);
                setShowTicketSelection(true);
            }
        });
    };

    const handleTicketSelection = (index) => {
        const chosenTicket = availableTickets[index];
        joinHouseRoom(chosenTicket, playerConfig, playerName);
        setShowTicketSelection(false);
    };

    if (!houseRoomState) {
        return <div className="text-center text-2xl p-10">Loading...</div>;
    }

    const isGameInProgress = houseRoomState.gameStarted;
    const { gameStartsIn, joinClosesIn, nextGameStartTime, canJoin } = timeDetails;

    const renderTimerBlock = () => {
        if (isGameInProgress) {
            return (
                <div>
                    <p className="text-gray-600">Room opens in:</p>
                    <p className="text-4xl font-bold text-blue-600 my-1">
                        {String(gameStartsIn.minutes).padStart(2, '0')}:{String(gameStartsIn.seconds).padStart(2, '0')}
                    </p>
                    <p className="text-gray-500">at {nextGameStartTime}</p>
                </div>
            );
        }

        if (canJoin) {
            return (
                <div>
                    <p className="text-gray-600">Joining closes in:</p>
                    <p className="text-4xl font-bold text-green-600 my-1">
                        {String(joinClosesIn.minutes).padStart(2, '0')}:{String(joinClosesIn.seconds).padStart(2, '0')}
                    </p>
                    <p className="text-gray-500 mt-2">Game starts at {nextGameStartTime}</p>
                </div>
            );
        }

        // If not in progress and can't join, it means the joining window is closed.
        return (
            <div>
                <p className="text-gray-600">Room opens in:</p>
                <p className="text-4xl font-bold text-blue-600 my-1">
                    {String(gameStartsIn.minutes).padStart(2, '0')}:{String(gameStartsIn.seconds).padStart(2, '0')}
                </p>
                <p className="text-gray-500">at {nextGameStartTime}</p>
            </div>
        );
    };

    return (
        <>
            <Header />
            <div className="bg-gray-100 min-h-screen p-8 font-sans">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">Public Rooms</h1>
                    {!showTicketSelection ? (
                        <div className="bg-white rounded-lg shadow-lg p-6 transition-all">
                            <div className="flex flex-col md:flex-row items-center justify-between">
                                <div className="md:w-2/3 mb-4 md:mb-0">
                                    <h3 className="text-2xl font-bold text-gray-900">The House</h3>
                                    <p className="text-gray-600">Join the house game and play against other players. Game starts every 30 minutes.</p>
                                    <p className="text-gray-600 mt-1">{Object.keys(houseRoomState.players).length} players currently waiting</p>
                                    <div className={`mt-4 text-lg font-semibold p-3 rounded-lg inline-block ${!canJoin ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                        {isGameInProgress ? 'Game in progress. Please wait.' : (canJoin ? 'Room is open! Join now.' : 'Joining closed. Game starting soon!')}
                                    </div>
                                </div>
                                <div className="md:w-1/3 text-center md:text-right mt-4 md:mt-0">
                                    {renderTimerBlock()}
                                </div>
                            </div>
                            <div className={`mt-6 pt-6 border-t ${!canJoin ? 'opacity-50' : ''}`}>
                                <div className="flex flex-col items-center">
                                    <input
                                        type="text"
                                        className="w-full max-w-sm px-4 py-2 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow shadow-sm"
                                        placeholder="Enter Your Name"
                                        value={playerName}
                                        onChange={(e) => setPlayerName(e.target.value)}
                                        disabled={!canJoin}
                                    />
                                    <button
                                        onClick={handleJoinClick}
                                        disabled={!canJoin}
                                        className="w-full max-w-sm bg-green-500 text-white py-3 px-6 rounded-lg font-semibold text-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-green-600"
                                    >
                                        Join Game
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="ticket-selection-container bg-white rounded-lg shadow-lg p-6">
                            <h3 className="text-2xl font-bold mb-4 text-center">Select Your Ticket</h3>
                            <p className="text-gray-600 mb-6 text-center">Choose one of the 5 generated tickets to join the game.</p>
                            <div className="grid grid-cols-1 gap-4">
                                {availableTickets.map((ticket, index) => (
                                    <div key={index} className="border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                                        <Ticket ticket={ticket} numbersCalled={[]} />
                                        <button
                                            onClick={() => handleTicketSelection(index)}
                                            className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                                        >
                                            Select this Ticket
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="text-center mt-6">
                                <button
                                    onClick={() => setShowTicketSelection(false)}
                                    className="bg-gray-400 text-white py-2 px-6 rounded-lg font-semibold hover:bg-gray-500 transition-colors"
                                >
                                    Back
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default PublicRoomsPage;