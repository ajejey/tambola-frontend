import React, { useContext } from 'react'
import './Home.css'
import Background from '../Background/Background'
import { useNavigate } from 'react-router-dom'
import { GlobalContext } from '../../context/Provider'
import HowToPlay from '../HowToPlay/HowToPlay'

export default function Home() {
    const navigate = useNavigate()
    const { userID, setUserID } = useContext(GlobalContext)

    const handleUsernameChange = (e) => {
        setUserID(e.target.value)
    }

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
            <div className='user-name-input'>
                <div>
                    <label htmlFor="username">Enter your Name</label>
                    <br />
                    <input type="text" id="username" value={userID} onChange={handleUsernameChange} />
                </div>
            </div>
            <div className="initial-screen">
                {userID.length === 0 && <p>Please enter user name to start!</p>}
                <p>Please choose an option:</p>
                <button disabled={userID.length === 0} className={userID.length === 0 ? "disabled-button" : ""} onClick={handleCreateRoom}>Create Room</button>
                <button disabled={userID.length === 0} className={userID.length === 0 ? "disabled-button" : ""} onClick={handleJoinRoom}>Join Room</button>
            </div>
            <HowToPlay />
        </div>
    )
}
