import React, { createContext, useState } from 'react';
import io from 'socket.io-client'

export const GlobalContext = createContext({});

export const GlobalProvider = ({ children }) => {

    const [roomID, setRoomID] = useState("")
    const [userID, setUserID] = useState("")
    const [allUsers, setAllUsers] = useState([])
    const [host, setHost] = useState("")
    const [allCategoriesClaimed, setAllCategoriesClaimed] = useState(false)
    const [userJoined, setUserJoined] = useState(false)
    // const socket = io("http://localhost:5000")
    const socket = io("https://tambola-backend-production.up.railway.app/")
    // const socket = io(process.env['REACT_APP_BACKEND_URL'])


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
                allCategoriesClaimed,
                setAllCategoriesClaimed,
                userJoined, setUserJoined,
                socket
            }}>
            {children}
        </GlobalContext.Provider>
    )
}
