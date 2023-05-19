import React, { useContext, useEffect } from 'react'
import './CreateRoom.css'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { nanoid } from 'nanoid';
import { GlobalContext } from '../../context/Provider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import Background from '../Background/Background';

export default function () {
    const { roomID, setRoomID, userID, setUserID, setHost, socket } = useContext(GlobalContext)
    const navigate = useNavigate()
    let [searchParams, setSearchParams] = useSearchParams();

    const handleCreateRoom = () => {
        if (userID.length && roomID.length) {
            socket.emit('join', { room: roomID, userName: userID })
            setHost(userID)
            navigate(`/game-room?userName=${userID}&roomName=${roomID}`)
        }
    }

    const handleCloseCreate = () => {
        searchParams.delete("userName")
        searchParams.delete("roomName")
        navigate("/")
    }

    const copyRoomNameToClipboard = () => {
        const roomNameInput = document.getElementById("roomName");
        if (roomNameInput) {
            roomNameInput.select();
            document.execCommand("copy");
        }
    }

    useEffect(() => {
        let newUserId = nanoid(4)
        let newRoomId = nanoid(6)
        setUserID(newUserId)
        setRoomID(newRoomId)
        setSearchParams({ userName: newUserId, roomName: newRoomId })
        console.log("room", newUserId, newRoomId)
    }, [])

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
            <div className="create-room-component">
                <h3>Create Room</h3>
                <label htmlFor="roomName">Room Name</label>
                <div className="room-name-input">
                    <input type="text" id="roomName" value={roomID} />
                    <button onClick={copyRoomNameToClipboard}>
                        <FontAwesomeIcon icon={faCopy} />
                    </button>
                </div>
                <div style={{ display: "flex", gap: "30px" }}>
                    <button onClick={handleCreateRoom}>Create</button>
                    <button onClick={handleCloseCreate}>Close</button>
                </div>
            </div>
        </div>
    )
}
