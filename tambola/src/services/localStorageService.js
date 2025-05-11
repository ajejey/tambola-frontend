/**
 * LocalStorage Service - Provides methods to store and retrieve game data
 */

// Keys for localStorage
const KEYS = {
  ROOM_ID: 'tambola_room_id',
  USER_ID: 'tambola_user_id',
  TICKET: 'tambola_ticket',
  STRUCK_NUMBERS: 'tambola_struck_numbers',
  CALLED_NUMBERS: 'tambola_called_numbers',
  CLAIMED_CATEGORIES: 'tambola_claimed_categories',
  ALL_USERS: 'tambola_all_users',
  HOST: 'tambola_host'
};

// Helper to get room-specific key
const getRoomKey = (key, roomId) => `${key}_${roomId}`;

// Helper to get user-specific key
const getUserKey = (key, roomId, userId) => `${key}_${roomId}_${userId}`;

const localStorageService = {
  // Room and user ID
  saveRoomId: (roomId) => {
    localStorage.setItem(KEYS.ROOM_ID, roomId);
  },
  
  getRoomId: () => {
    return localStorage.getItem(KEYS.ROOM_ID) || '';
  },
  
  saveUserId: (userId) => {
    localStorage.setItem(KEYS.USER_ID, userId);
  },
  
  getUserId: () => {
    return localStorage.getItem(KEYS.USER_ID) || '';
  },
  
  // Ticket
  saveTicket: (ticket, roomId, userId) => {
    localStorage.setItem(
      getUserKey(KEYS.TICKET, roomId, userId),
      JSON.stringify(ticket)
    );
  },
  
  getTicket: (roomId, userId) => {
    const ticketData = localStorage.getItem(
      getUserKey(KEYS.TICKET, roomId, userId)
    );
    return ticketData ? JSON.parse(ticketData) : [];
  },
  
  // Struck numbers
  saveStruckNumbers: (numbers, roomId, userId) => {
    localStorage.setItem(
      getUserKey(KEYS.STRUCK_NUMBERS, roomId, userId),
      JSON.stringify(numbers)
    );
  },
  
  getStruckNumbers: (roomId, userId) => {
    const numbersData = localStorage.getItem(
      getUserKey(KEYS.STRUCK_NUMBERS, roomId, userId)
    );
    return numbersData ? JSON.parse(numbersData) : [];
  },
  
  // Called numbers
  saveCalledNumbers: (numbers, roomId) => {
    localStorage.setItem(
      getRoomKey(KEYS.CALLED_NUMBERS, roomId),
      JSON.stringify(numbers)
    );
  },
  
  getCalledNumbers: (roomId) => {
    const numbersData = localStorage.getItem(
      getRoomKey(KEYS.CALLED_NUMBERS, roomId)
    );
    return numbersData ? JSON.parse(numbersData) : [];
  },
  
  // Claimed categories
  saveClaimedCategories: (categories, roomId) => {
    localStorage.setItem(
      getRoomKey(KEYS.CLAIMED_CATEGORIES, roomId),
      JSON.stringify(categories)
    );
  },
  
  getClaimedCategories: (roomId) => {
    const categoriesData = localStorage.getItem(
      getRoomKey(KEYS.CLAIMED_CATEGORIES, roomId)
    );
    return categoriesData ? JSON.parse(categoriesData) : [];
  },
  
  // All users
  saveAllUsers: (users, roomId) => {
    localStorage.setItem(
      getRoomKey(KEYS.ALL_USERS, roomId),
      JSON.stringify(users)
    );
  },
  
  getAllUsers: (roomId) => {
    const usersData = localStorage.getItem(
      getRoomKey(KEYS.ALL_USERS, roomId)
    );
    return usersData ? JSON.parse(usersData) : [];
  },
  
  // Host
  saveHost: (host, roomId) => {
    localStorage.setItem(
      getRoomKey(KEYS.HOST, roomId),
      host
    );
  },
  
  getHost: (roomId) => {
    return localStorage.getItem(
      getRoomKey(KEYS.HOST, roomId)
    ) || '';
  },
  
  // Clear all data for a room
  clearRoomData: (roomId) => {
    // Get all keys in localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      // Remove all keys that contain the roomId
      if (key && key.includes(roomId)) {
        localStorage.removeItem(key);
      }
    }
  }
};

export default localStorageService;
