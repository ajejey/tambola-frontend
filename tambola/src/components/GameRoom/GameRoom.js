import React, { useContext, useEffect } from 'react'
import './GameRoom.css'
import Board from '../Board/Board'
import TicketDisplay from '../TicketDisplay/TicketDisplay'
import PlayerList from '../PlayerList/PlayerList'
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
            <div onClick={handleHomeButtonClick} className="tambola">
                <span>T</span>
                <span>a</span>
                <span>m</span>
                <span>b</span>
                <span>o</span>
                <span>l</span>
                <span>a</span>
            </div>
            <button onClick={handleHomeButtonClick} style={{ width: "100px", margin: "12px 3vw", padding: "8px", borderRadius: "5px", cursor: "pointer" }}>Home</button>
            <div style={{ display: 'flex', justifyContent: "space-between", marginLeft: "3vw" }}>
                <Board />
                <TicketDisplay />
            </div>
            {/* <Board />
            <br />
            <TicketDisplay /> */}
            <PlayerList />
        </div>
    )
}
