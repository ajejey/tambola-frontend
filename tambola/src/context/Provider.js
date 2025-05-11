import React, { createContext, useState, useEffect } from 'react';
import io from 'socket.io-client';
import localStorageService from '../services/localStorageService';

export const GlobalContext = createContext({});

export const GlobalProvider = ({ children }) => {
    // Initialize state from localStorage if available
    const [roomID, setRoomID] = useState(localStorageService.getRoomId())
    const [userID, setUserID] = useState(localStorageService.getUserId())
    const [allUsers, setAllUsers] = useState([])
    
    // Initialize host from localStorage if available
    const [host, setHost] = useState(() => {
        // If we have a roomID, try to get the host from localStorage
        const storedRoomId = localStorageService.getRoomId();
        if (storedRoomId) {
            const storedHost = localStorageService.getHost(storedRoomId);
            console.log("Initializing host from localStorage:", storedHost);
            return storedHost || "";
        }
        return "";
    })
    const [allCategoriesClaimed, setAllCategoriesClaimed] = useState(false)
    const [userJoined, setUserJoined] = useState(false)
    
    // Connect to the backend server
    // const socket = io("http://localhost:5000")
    const socket = io("https://tambola-backend-production.up.railway.app/")
    // const socket = io(process.env['REACT_APP_BACKEND_URL'])
    
    // Save roomID to localStorage when it changes
    useEffect(() => {
        if (roomID) {
            localStorageService.saveRoomId(roomID);
        }
    }, [roomID]);
    
    // Save userID to localStorage when it changes
    useEffect(() => {
        if (userID) {
            localStorageService.saveUserId(userID);
        }
    }, [userID]);
    
    // Save allUsers to localStorage when it changes
    useEffect(() => {
        if (allUsers.length > 0 && roomID) {
            localStorageService.saveAllUsers(allUsers, roomID);
        }
    }, [allUsers, roomID]);
    
    // Save host to localStorage when it changes
    useEffect(() => {
        if (host && roomID) {
            localStorageService.saveHost(host, roomID);
        }
    }, [host, roomID]);


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
