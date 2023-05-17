import React from 'react'
import './Home.css'
import Background from '../Background/Background'
import { useNavigate } from 'react-router-dom'

export default function Home() {
    const navigate = useNavigate()

    const handleCreateRoom = () => {
        navigate("/create-room")
    }

    const handleJoinRoom = () => {
        navigate("/join-room")
    }

    return (
        <div>
            <Background />
            <div className="tambola">
                <span>T</span>
                <span>a</span>
                <span>m</span>
                <span>b</span>
                <span>o</span>
                <span>l</span>
                <span>a</span>
            </div>
            <div className="initial-screen">
                <p>Please choose an option:</p>
                <button onClick={handleCreateRoom}>Create Room</button>
                <button onClick={handleJoinRoom}>Join Room</button>
            </div>
        </div>
    )
}
