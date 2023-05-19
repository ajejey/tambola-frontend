import React, { useContext, useEffect } from 'react'
import './GameRoom.css'
import Board from '../Board/Board'
import TicketDisplay from '../TicketDisplay/TicketDisplay'
import PlayerList from '../PlayerList/PlayerList'
import { GlobalContext } from '../../context/Provider'
import { useSearchParams } from 'react-router-dom'

export default function GameRoom() {
    const { setRoomID, setUserID, socket } = useContext(GlobalContext)
    let [searchParams, setSearchParams] = useSearchParams();

    // useEffect(() => {
    //     socket.on('join', joiningConfirmation => {
    //         console.log("inside socket joiningConfirmation", joiningConfirmation);
    //     });
    // }, [socket])

    useEffect(() => {
        if (Object.fromEntries([...searchParams])) {
            setUserID(Object.fromEntries([...searchParams]).userName)
            setRoomID(Object.fromEntries([...searchParams]).roomName)
            socket.emit('join', { userName: Object.fromEntries([...searchParams]).userName, room: Object.fromEntries([...searchParams]).roomName })
        }
    }, [])

    return (
        <div className='main-background'>
            <div className="tambola">
                <span>T</span>
                <span>a</span>
                <span>m</span>
                <span>b</span>
                <span>o</span>
                <span>l</span>
                <span>a</span>
            </div>
            <Board />
            <br />
            <TicketDisplay />
            <PlayerList />
        </div>
    )
}
