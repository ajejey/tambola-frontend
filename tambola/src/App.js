import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import HomePage from './pages/HomePage';
import RoomPage from './pages/RoomPage';
import PublicRoomsPage from './pages/PublicRoomsPage';
import Notification from './components/Notification';
import PrivacyPolicy from './oldComponents/PrivacyPolicy/PrivacyPolicy';
import TermsOfService from './oldComponents/TermsOfService/TermsOfService';
import AboutUs from './oldComponents/AboutUs/AboutUs';
import Contact from './oldComponents/Contact/Contact';
import FAQ from './oldComponents/FAQ/FAQ';
import Blog from './oldComponents/Blog/Blog';
import BlogPost from './oldComponents/Blog/BlogPost';
import ReactGA from "react-ga4";
import MoreGames from './pages/MoreGames';

const socket = io('https://tambola-backend-production.up.railway.app/' || 'http://localhost:3001');

function App() {
  ReactGA.initialize("G-HRZVY37W6Q");
  const [room, setRoom] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [gameState, setGameState] = useState(null);
  const [houseRoomState, setHouseRoomState] = useState(null);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [myPlayerId, setMyPlayerId] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const reconnectDataString = localStorage.getItem('tambolaGame');
    if (reconnectDataString) {
      const reconnectData = JSON.parse(reconnectDataString);
      const now = new Date().getTime();

      if (reconnectData.timestamp && (now - reconnectData.timestamp < 7200000)) { // 2 hours
        setMyPlayerId(reconnectData.playerId);
        socket.emit('reconnectPlayer', { ...reconnectData, playerName: reconnectData.playerName }, (response) => {
          if (response.error) {
            setError('Failed to reconnect. Please refresh the page to try again.');
            setMyPlayerId(null);
            localStorage.removeItem('tambolaGame');
          } else {
            setRoom(reconnectData.roomName);
            setMyPlayerId(response.playerId);
            setGameState(response.gameState);
            const gameData = {
              roomName: reconnectData.roomName,
              playerId: response.playerId,
              timestamp: new Date().getTime()
            };
            localStorage.setItem('tambolaGame', JSON.stringify(gameData));
            navigate(`/room/${reconnectData.roomName}`);
          }
        });
      } else {
        localStorage.removeItem('tambolaGame');
      }
    }

    socket.on('updateGameState', (newGameState) => {
      setGameState(newGameState);
      setError('');
    });

    socket.on('prizeClaimed', ({ player, prize }) => {
      setNotification({ message: `${player} has claimed ${prize}!`, type: 'success' });
    });

    socket.on('gameOver', () => {
      setNotification({ message: 'Game Over! The room is now closed.', type: 'success' });
      setIsGameOver(true);
    });

    socket.emit('getHouseRoomState');
    socket.on('updateHouseRoomState', (newHouseRoomState) => {
      setHouseRoomState(newHouseRoomState);
    });

    return () => {
      socket.off('updateGameState');
      socket.off('prizeClaimed');
      socket.off('gameOver');
      socket.off('updateHouseRoomState');
    };
  }, [navigate]);

  const handleCreateRoom = (gameConfig, chosenTicket, playerConfig) => {
    socket.emit('createRoom', { config: gameConfig, ticket: chosenTicket, playerConfig }, (response) => {
      if (response.error) {
        setError(response.error);
      } else {
        setPlayerName('Host');
        setMyPlayerId(response.playerId);
        const gameData = {
          roomName: response.roomName,
          playerId: response.playerId,
          playerName: playerName, // Save player name
          timestamp: new Date().getTime()
        };
        localStorage.setItem('tambolaGame', JSON.stringify(gameData));
        navigate(`/room/${response.roomName}`);
      }
    });
  };

  const handleJoinRoom = (chosenTicket, playerConfig) => {
    socket.emit('joinRoom', room, playerName, chosenTicket, playerConfig, (response) => {
      if (response.error) {
        setError(response.error);
      } else {
        setMyPlayerId(response.playerId);
        const gameData = {
          roomName: response.roomName,
          playerId: response.playerId,
          playerName: playerName, // Save player name
          timestamp: new Date().getTime()
        };
        localStorage.setItem('tambolaGame', JSON.stringify(gameData));
        navigate(`/room/${room}`);
      }
    });
  };

  const handleJoinHouseRoom = (chosenTicket, playerConfig, name) => {
    socket.emit('joinRoom', 'house', name, chosenTicket, playerConfig, (response) => {
        if (response.error) {
            setError(response.error);
        } else {
            setMyPlayerId(response.playerId);
            const gameData = {
                roomName: 'house',
                playerId: response.playerId,
                playerName: name, // Save player name
                timestamp: new Date().getTime()
            };
            localStorage.setItem('tambolaGame', JSON.stringify(gameData));
            navigate(`/room/house`);
        }
    });
  };

  const handleStartGame = () => {
    socket.emit('startGame', room);
  };

  const handleClaimPrize = (prizeToClaim, struckNumbers) => {
    socket.emit('claimPrize', room, prizeToClaim, struckNumbers, (response) => {
      if (response.error) {
        setNotification({ message: response.error, type: 'error' });
      } else {
        setNotification({ message: `${prizeToClaim} claimed successfully!`, type: 'success' });
      }
    });
  };

  const handleLeaveGame = () => {
    localStorage.removeItem('tambolaGame');
    setGameState(null);
    setRoom('');
    setPlayerName('');
    setIsGameOver(false);
    navigate('/');
  };

  const closeNotification = () => {
    setNotification({ message: '', type: '' });
  };

  const handleUpdateCallingInterval = (newInterval) => {
    socket.emit('updateCallingInterval', { roomName: room, interval: newInterval });
  };

  const handleToggleAutoCalling = (isAuto) => {
    socket.emit('toggleAutoCalling', { roomName: room, autoCalling: isAuto });
  };

  const handleManualCall = () => {
    socket.emit('manualCall', room);
  };

  const requestTickets = (callback) => {
    socket.emit('requestTickets', callback);
  };

  return (
    <>
      <Notification message={notification.message} type={notification.type} onClose={closeNotification} />
      <Routes>
        <Route path="/" element={<HomePage room={room} setRoom={setRoom} playerName={playerName} setPlayerName={setPlayerName} handleCreateRoom={handleCreateRoom} handleJoinRoom={handleJoinRoom} error={error} requestTickets={requestTickets} />} />
        <Route path="/public-rooms" element={<PublicRoomsPage houseRoomState={houseRoomState} joinHouseRoom={handleJoinHouseRoom} requestTickets={requestTickets} />} />
        <Route path="/room/:roomName" element={<RoomPage gameState={gameState} myPlayerId={myPlayerId} handleStartGame={handleStartGame} handleClaimPrize={handleClaimPrize} handleLeaveGame={handleLeaveGame} isGameOver={isGameOver} onUpdateInterval={handleUpdateCallingInterval} onToggleAutoCalling={handleToggleAutoCalling} onManualCall={handleManualCall} />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/more-games" element={<MoreGames />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:postId" element={<BlogPost />} />
      </Routes>
    </>
  );
}

export default App;
