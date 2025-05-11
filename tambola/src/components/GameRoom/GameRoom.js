import React, { useContext, useEffect } from 'react'
import './GameRoom.css'
import Board from '../Board/Board'
import TicketDisplay from '../TicketDisplay/TicketDisplay'
import PlayerList from '../PlayerList/PlayerList'
import Header from '../Header/Header'
import { GlobalContext } from '../../context/Provider'
import { useNavigate, useSearchParams } from 'react-router-dom'
import localStorageService from '../../services/localStorageService'

export default function GameRoom() {
    const { setRoomID, setUserID, userJoined, setUserJoined, socket, setHost } = useContext(GlobalContext)
    const navigate = useNavigate()
    let [searchParams, setSearchParams] = useSearchParams();

    const handleHomeButtonClick = () => {
        setRoomID("")
        navigate("/")
    }

    useEffect(() => {
        socket.on('join', joiningConfirmation => {
            console.log("inside socket joiningConfirmation", joiningConfirmation);
            
            // Check if the response contains host information
            if (joiningConfirmation.host) {
                // Update the host in the global context
                setHost(joiningConfirmation.host);
            }
            
            if (joiningConfirmation.joined === true) {
                setUserJoined(true);
            }
        });
        
        // Clean up event listener on unmount
        return () => {
            socket.off('join');
        };
    }, [socket, setHost])

    useEffect(() => {
        if (Object.fromEntries([...searchParams])) {
            const userName = Object.fromEntries([...searchParams]).userName;
            const roomName = Object.fromEntries([...searchParams]).roomName;
            
            setUserID(userName);
            setRoomID(roomName);
            
            // Check if this user is the host from localStorage
            const storedHost = localStorageService.getHost(roomName);
            const isHost = storedHost === userName;
            
            console.log("Joining room with host status:", isHost ? "I am the host" : "I am not the host");
            
            // Send the join event with host information
            socket.emit('join', { 
                userName: userName, 
                room: roomName,
                isHost: isHost
            });
        }
    }, [])

    return (
        <div className='main-background'>
            <Header />
            <div onClick={handleHomeButtonClick} className="tambola">
                <span>T</span>
                <span>a</span>
                <span>m</span>
                <span>b</span>
                <span>o</span>
                <span>l</span>
                <span>a</span>
            </div>
            <button onClick={handleHomeButtonClick} className="home-button">Home</button>
            <div className="game-container">
                <Board />
                <TicketDisplay />
            </div>
            <PlayerList />
        </div>
    )
}
