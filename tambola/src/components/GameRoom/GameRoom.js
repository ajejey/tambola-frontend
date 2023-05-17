import React, { useContext } from 'react'
import './GameRoom.css'
import Board from '../Board/Board'
import TicketDisplay from '../TicketDisplay/TicketDisplay'
import PlayerList from '../PlayerList/PlayerList'
import { GlobalContext } from '../../context/Provider'

export default function GameRoom() {
    const { roomID, userID } = useContext(GlobalContext)
    console.log("in game", roomID, userID)

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
            <div style={{ display: "flex", justifyContent: "space-between", marginLeft: "5vw"}}>
                <div>Current Number: <strong>{12}</strong></div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "20px", marginRight: "5vw", marginBottom: "20px" }}>
                    <div>Room name: {roomID || 123}</div>
                    <div>User name: {userID || 567}</div>
                </div>
            </div>
            <Board />
            <br />
            <TicketDisplay />
            <PlayerList />
        </div>
    )
}
