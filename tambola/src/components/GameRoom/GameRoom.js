import React, { useContext, useEffect } from 'react'
import './GameRoom.css'
import Board from '../Board/Board'
import TicketDisplay from '../TicketDisplay/TicketDisplay'
import PlayerList from '../PlayerList/PlayerList'
import Header from '../Header/Header'
import { GlobalContext } from '../../context/Provider'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function GameRoom() {
    const { setRoomID, setUserID,userJoined, setUserJoined, socket } = useContext(GlobalContext)
    const navigate = useNavigate()
    let [searchParams, setSearchParams] = useSearchParams();

    const handleHomeButtonClick = () => {
        setRoomID("")
        navigate("/")
    }

    useEffect(() => {
        socket.on('join', joiningConfirmation => {
            console.log("inside socket joiningConfirmation", joiningConfirmation);
            if (joiningConfirmation.joined === true) {
                setUserJoined(true)
            }
        });
    }, [socket])

    useEffect(() => {
        if (Object.fromEntries([...searchParams])) {
            setUserID(Object.fromEntries([...searchParams]).userName)
            setRoomID(Object.fromEntries([...searchParams]).roomName)
            // if(userJoined === false){
                socket.emit('join', { userName: Object.fromEntries([...searchParams]).userName, room: Object.fromEntries([...searchParams]).roomName })
            // }
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
