import React, { createContext, useState } from 'react';

export const GlobalContext = createContext({});

export const GlobalProvider = ({ children }) => {

    const [roomID, setRoomID] = useState("")
    const [userID, setUserID] = useState("")

    return (
        <GlobalContext.Provider
            value={{
                roomID, 
                setRoomID,
                userID, 
                setUserID
            }}>
            {children}
        </GlobalContext.Provider>
    )
}