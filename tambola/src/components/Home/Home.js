import React, { useContext } from 'react'
import './Home.css'
import Background from '../Background/Background'
import Header from '../Header/Header'
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
            <Header />
            <div className="tambola">
                <span>T</span>
                <span>a</span>
                <span>m</span>
                <span>b</span>
                <span>o</span>
                <span>l</span>
                <span>a</span>
            </div>
            <div className="welcome-container">
                <div className="welcome-card">
                    <h2 className="welcome-title">Welcome to Tambola</h2>
                    
                    <div className="input-container">
                        <div className="input-field">
                            <input 
                                type="text" 
                                id="username" 
                                value={userID} 
                                onChange={handleUsernameChange} 
                                // placeholder="Enter your name"
                                autoComplete="off"
                            />
                            <label htmlFor="username" className={userID.length > 0 ? "active" : ""}>
                                Your Name
                            </label>
                        </div>
                        
                        {userID.length === 0 && 
                            <div className="input-message">
                                Please enter your name to start playing
                            </div>
                        }
                    </div>
                    
                    <div className="action-buttons">
                        <button 
                            disabled={userID.length === 0} 
                            className={`create-button ${userID.length === 0 ? "disabled" : ""}`} 
                            onClick={handleCreateRoom}
                        >
                            <span className="button-icon">+</span>
                            Create Room
                        </button>
                        <button 
                            disabled={userID.length === 0} 
                            className={`join-button ${userID.length === 0 ? "disabled" : ""}`} 
                            onClick={handleJoinRoom}
                        >
                            <span className="button-icon">→</span>
                            Join Room
                        </button>
                    </div>
                </div>
            </div>
            <HowToPlay />
        </div>
    )
}
