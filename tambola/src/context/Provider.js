import React, { createContext, useState } from 'react';
import io from 'socket.io-client'

export const GlobalContext = createContext({});

export const GlobalProvider = ({ children }) => {

    const [roomID, setRoomID] = useState("")
    const [userID, setUserID] = useState("")
    const [allUsers, setAllUsers] = useState([])
    const [host, setHost] = useState("")
    // const socket = io("http://localhost:5000")
    const socket = io("https://tambola-backend-production.up.railway.app/")

    return (
        <GlobalContext.Provider
            value={{
                roomID, 
                setRoomID,
                userID, 
                setUserID,
                allUsers, 
                setAllUsers,
                host, 
                setHost,
                socket
            }}>
            {children}
        </GlobalContext.Provider>
    )
}