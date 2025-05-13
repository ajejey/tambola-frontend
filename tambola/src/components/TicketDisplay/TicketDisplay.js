import React, { useState, useEffect } from 'react';
import './ticketDisplay.css';
import { useContext } from 'react';
import { GlobalContext } from '../../context/Provider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { scoreCategories } from '../../constants/constants';
import { useSearchParams } from 'react-router-dom';
import localStorageService from '../../services/localStorageService';

function TicketDisplay() {
  const { roomID, userID, setAllUsers, setHost, setAllCategoriesClaimed, userJoined, socket } = useContext(GlobalContext)
  
  // Initialize state from localStorage if available
  const [ticket, setTicket] = useState(() => {
    return localStorageService.getTicket(roomID, userID) || [];
  });
  
  const [struckNumbers, setStruckNumbers] = useState(() => {
    return localStorageService.getStruckNumbers(roomID, userID) || [];
  });
  
  const [claimedCategories, setClaimedCategories] = useState(() => {
    return localStorageService.getClaimedCategories(roomID) || [];
  });
  
  const [calledNumbers, setCalledNumbers] = useState(() => {
    return localStorageService.getCalledNumbers(roomID) || [];
  });
  
  const [showNotification, setShowNotification] = useState(false);
  let [searchParams, setSearchParams] = useSearchParams();
  const [claimed, setClaimed] = useState([])
  const [disabledButtons, setDisabledButtons] = useState([]);
  const [lastCalledNumber, setLastCalledNumber] = useState(null);

  const checkClaimedCategory = (claimedCategory) => {
    let claimIsValid = false;
    // Use a Set to ensure unique struck numbers
    let struckNumbersCopy = [...new Set(struckNumbers)];
    
    // Debug logging to help diagnose issues
    console.log("Checking claim for:", claimedCategory);
    console.log("Current ticket:", ticket);
    console.log("Struck numbers:", struckNumbersCopy);
    
    if (ticket && ticket.length) {
      switch (claimedCategory) {
        case 'EARLY_FIVE':
          // Simply check if at least 5 numbers are struck
          if (struckNumbersCopy.length >= 5) {
            claimIsValid = true;
            console.log("EARLY_FIVE claim is valid");
          }
          break;
          
        case 'EARLY_SEVEN':
          // Simply check if at least 7 numbers are struck
          if (struckNumbersCopy.length >= 7) {
            claimIsValid = true;
            console.log("EARLY_SEVEN claim is valid");
          }
          break;
          
        case 'MIDDLE_NUMBER':
          try {
            // Find the middle number in the middle row
            // First get all non-null numbers in the middle row
            const middleRowNumbers = ticket[1].filter(num => num !== null);
            // The middle number should be the 3rd number (index 2) in the filtered array
            if (middleRowNumbers.length >= 3) {
              const middleNumber = middleRowNumbers[2];
              console.log("Middle number:", middleNumber);
              if (struckNumbersCopy.includes(middleNumber)) {
                claimIsValid = true;
                console.log("MIDDLE_NUMBER claim is valid");
              }
            }
          } catch (error) {
            console.error("Error checking MIDDLE_NUMBER:", error);
          }
          break;
          
        case 'FIRST_LINE':
          try {
            // Get all non-null numbers in the first row
            const firstLineNumbers = ticket[0].filter(num => num !== null);
            console.log("First line numbers:", firstLineNumbers);
            console.log("Struck numbers:", struckNumbersCopy);
            
            // Debug output to check each number individually
            firstLineNumbers.forEach(num => {
              console.log(`Number ${num} is struck: ${struckNumbersCopy.includes(num)}`);
            });
            
            // Check if all numbers in the first row are struck
            if (firstLineNumbers.length > 0) {
              const allStruck = firstLineNumbers.every(number => {
                // Convert both to numbers to ensure proper comparison
                return struckNumbersCopy.some(struckNum => Number(struckNum) === Number(number));
              });
              
              if (allStruck) {
                claimIsValid = true;
                console.log("FIRST_LINE claim is valid");
              } else {
                console.log("FIRST_LINE claim is NOT valid - not all numbers are struck");
              }
            }
          } catch (error) {
            console.error("Error checking FIRST_LINE:", error);
          }
          break;
          
        case 'MIDDLE_LINE':
          try {
            // Get all non-null numbers in the middle row
            const midLineNumbers = ticket[1].filter(num => num !== null);
            console.log("Middle line numbers:", midLineNumbers);
            console.log("Struck numbers:", struckNumbersCopy);
            
            // Debug output to check each number individually
            midLineNumbers.forEach(num => {
              console.log(`Number ${num} is struck: ${struckNumbersCopy.some(n => Number(n) === Number(num))}`);
            });
            
            // Check if all numbers in the middle row are struck
            if (midLineNumbers.length > 0) {
              const allStruck = midLineNumbers.every(number => {
                // Convert both to numbers to ensure proper comparison
                return struckNumbersCopy.some(struckNum => Number(struckNum) === Number(number));
              });
              
              if (allStruck) {
                claimIsValid = true;
                console.log("MIDDLE_LINE claim is valid");
              } else {
                console.log("MIDDLE_LINE claim is NOT valid - not all numbers are struck");
              }
            }
          } catch (error) {
            console.error("Error checking MIDDLE_LINE:", error);
          }
          break;
          
        case 'LAST_LINE':
          try {
            // Get all non-null numbers in the last row
            const lastLineNumbers = ticket[2].filter(num => num !== null);
            console.log("Last line numbers:", lastLineNumbers);
            console.log("Struck numbers:", struckNumbersCopy);
            
            // Debug output to check each number individually
            lastLineNumbers.forEach(num => {
              console.log(`Number ${num} is struck: ${struckNumbersCopy.some(n => Number(n) === Number(num))}`);
            });
            
            // Check if all numbers in the last row are struck
            if (lastLineNumbers.length > 0) {
              const allStruck = lastLineNumbers.every(number => {
                // Convert both to numbers to ensure proper comparison
                return struckNumbersCopy.some(struckNum => Number(struckNum) === Number(number));
              });
              
              if (allStruck) {
                claimIsValid = true;
                console.log("LAST_LINE claim is valid");
              } else {
                console.log("LAST_LINE claim is NOT valid - not all numbers are struck");
              }
            }
          } catch (error) {
            console.error("Error checking LAST_LINE:", error);
          }
          break;
          
        case 'CORNERS_1':
          try {
            // Allow claiming CORNERS_1 regardless of CORNERS_2 status
            // Get the corner numbers
            const firstRow = ticket[0].filter(num => num !== null);
            const lastRow = ticket[2].filter(num => num !== null);
            
            if (firstRow.length >= 5 && lastRow.length >= 5) {
              const topLeft = firstRow[0];
              const topRight = firstRow[4];
              const bottomLeft = lastRow[0];
              const bottomRight = lastRow[4];
              
              console.log("Corner numbers (CORNERS_1):", [topLeft, topRight, bottomLeft, bottomRight]);
              console.log("Struck numbers for corners check:", struckNumbersCopy);
              
              // Debug each corner individually
              console.log(`TopLeft ${topLeft} struck: ${struckNumbersCopy.some(n => Number(n) === Number(topLeft))}`);
              console.log(`TopRight ${topRight} struck: ${struckNumbersCopy.some(n => Number(n) === Number(topRight))}`);
              console.log(`BottomLeft ${bottomLeft} struck: ${struckNumbersCopy.some(n => Number(n) === Number(bottomLeft))}`);
              console.log(`BottomRight ${bottomRight} struck: ${struckNumbersCopy.some(n => Number(n) === Number(bottomRight))}`);
              
              // Use proper number comparison
              if (struckNumbersCopy.some(n => Number(n) === Number(topLeft)) && 
                  struckNumbersCopy.some(n => Number(n) === Number(topRight)) && 
                  struckNumbersCopy.some(n => Number(n) === Number(bottomLeft)) && 
                  struckNumbersCopy.some(n => Number(n) === Number(bottomRight))) {
                claimIsValid = true;
                console.log("CORNERS_1 claim is valid");
              } else {
                console.log("CORNERS_1 claim is NOT valid - not all corners are struck");
              }
            }
          } catch (error) {
            console.error("Error checking CORNERS_1:", error);
          }
          break;
          
        case 'CORNERS_2':
          try {
            // Allow claiming CORNERS_2 regardless of CORNERS_1 status
            // Get the corner numbers
            const firstRow = ticket[0].filter(num => num !== null);
            const lastRow = ticket[2].filter(num => num !== null);
            
            if (firstRow.length >= 5 && lastRow.length >= 5) {
              const topLeft = firstRow[0];
              const topRight = firstRow[4];
              const bottomLeft = lastRow[0];
              const bottomRight = lastRow[4];
              
              console.log("Corner numbers (CORNERS_2):", [topLeft, topRight, bottomLeft, bottomRight]);
              console.log("Struck numbers for corners check:", struckNumbersCopy);
              
              // Debug each corner individually
              console.log(`TopLeft ${topLeft} struck: ${struckNumbersCopy.some(n => Number(n) === Number(topLeft))}`);
              console.log(`TopRight ${topRight} struck: ${struckNumbersCopy.some(n => Number(n) === Number(topRight))}`);
              console.log(`BottomLeft ${bottomLeft} struck: ${struckNumbersCopy.some(n => Number(n) === Number(bottomLeft))}`);
              console.log(`BottomRight ${bottomRight} struck: ${struckNumbersCopy.some(n => Number(n) === Number(bottomRight))}`);
              
              // Use proper number comparison
              if (struckNumbersCopy.some(n => Number(n) === Number(topLeft)) && 
                  struckNumbersCopy.some(n => Number(n) === Number(topRight)) && 
                  struckNumbersCopy.some(n => Number(n) === Number(bottomLeft)) && 
                  struckNumbersCopy.some(n => Number(n) === Number(bottomRight))) {
                claimIsValid = true;
                console.log("CORNERS_2 claim is valid");
              } else {
                console.log("CORNERS_2 claim is NOT valid - not all corners are struck");
              }
            }
          } catch (error) {
            console.error("Error checking CORNERS_2:", error);
          }
          break;
        case 'STAR_1':
          try {
            // Allow claiming STAR_1 regardless of STAR_2 status
            // Get the corner numbers and middle number
            const firstRow = ticket[0].filter(num => num !== null);
            const middleRow = ticket[1].filter(num => num !== null);
            const lastRow = ticket[2].filter(num => num !== null);
            
            if (firstRow.length >= 5 && middleRow.length >= 3 && lastRow.length >= 5) {
              const topLeft = firstRow[0];
              const topRight = firstRow[4];
              const middle = middleRow[2];
              const bottomLeft = lastRow[0];
              const bottomRight = lastRow[4];
              
              console.log("Star numbers (STAR_1):", [topLeft, topRight, middle, bottomLeft, bottomRight]);
              
              if (struckNumbersCopy.includes(topLeft) && 
                  struckNumbersCopy.includes(topRight) && 
                  struckNumbersCopy.includes(middle) && 
                  struckNumbersCopy.includes(bottomLeft) && 
                  struckNumbersCopy.includes(bottomRight)) {
                claimIsValid = true;
                console.log("STAR_1 claim is valid");
              }
            }
          } catch (error) {
            console.error("Error checking STAR_1:", error);
          }
          break;
          
        case 'STAR_2':
          try {
            // Allow claiming STAR_2 regardless of STAR_1 status
            // Get the corner numbers and middle number
            const firstRow = ticket[0].filter(num => num !== null);
            const middleRow = ticket[1].filter(num => num !== null);
            const lastRow = ticket[2].filter(num => num !== null);
            
            if (firstRow.length >= 5 && middleRow.length >= 3 && lastRow.length >= 5) {
              const topLeft = firstRow[0];
              const topRight = firstRow[4];
              const middle = middleRow[2];
              const bottomLeft = lastRow[0];
              const bottomRight = lastRow[4];
              
              console.log("Star numbers (STAR_2):", [topLeft, topRight, middle, bottomLeft, bottomRight]);
              
              if (struckNumbersCopy.includes(topLeft) && 
                  struckNumbersCopy.includes(topRight) && 
                  struckNumbersCopy.includes(middle) && 
                  struckNumbersCopy.includes(bottomLeft) && 
                  struckNumbersCopy.includes(bottomRight)) {
                claimIsValid = true;
                console.log("STAR_2 claim is valid");
              }
            }
          } catch (error) {
            console.error("Error checking STAR_2:", error);
          }
          break;
          
        case 'FULL_HOUSE_1':
          try {
            // Allow claiming FULL_HOUSE_1 regardless of FULL_HOUSE_2 status
            // Get all non-null numbers in the ticket
            const allNumbers = ticket.flat().filter(num => num !== null);
            console.log("All ticket numbers (FULL_HOUSE_1):", allNumbers);
            
            // Check if all numbers in the ticket are struck
            if (allNumbers.length > 0 && 
                allNumbers.every(number => struckNumbersCopy.includes(number))) {
              claimIsValid = true;
              console.log("FULL_HOUSE_1 claim is valid");
            }
          } catch (error) {
            console.error("Error checking FULL_HOUSE_1:", error);
          }
          break;
          
        case 'FULL_HOUSE_2':
          try {
            // Allow claiming FULL_HOUSE_2 regardless of FULL_HOUSE_1 status
            // Get all non-null numbers in the ticket
            const allNumbers = ticket.flat().filter(num => num !== null);
            console.log("All ticket numbers (FULL_HOUSE_2):", allNumbers);
            
            // Check if all numbers in the ticket are struck
            if (allNumbers.length > 0 && 
                allNumbers.every(number => struckNumbersCopy.includes(number))) {
              claimIsValid = true;
              console.log("FULL_HOUSE_2 claim is valid");
            }
          } catch (error) {
            console.error("Error checking FULL_HOUSE_2:", error);
          }
          break;
        default:
          // Handle other categories or unknown category
          console.log("Unknown category");
          break;
      }
      return claimIsValid
    }
  }

  const handleChipClick = (category) => {
    console.log("clicked", category, scoreCategories.find((item) => item.category === category))
    const isCategoryClaimed = claimedCategories.includes(category);
    if (isCategoryClaimed) {
      return; // Exit the function if the category is already claimed
    }

    // Disable the button
    setDisabledButtons([...disabledButtons, category]);
    setTimeout(() => {
      setDisabledButtons(disabledButtons.filter((button) => button !== category));
    }, 2000);

    let checkCategory = checkClaimedCategory(category)
    console.log("check category", checkCategory)
    if (checkCategory === false) {
      setShowNotification(true); // Show the notification if checkCategory is false
      // Hide the notification after 5 seconds
      setTimeout(() => {
        setShowNotification(false);
      }, 5000);
    }
    if (userID.length && roomID.length && checkCategory) {
      socket.emit('category', { userName: userID, room: roomID, scoreCategory: scoreCategories.find((item) => item.category === category) })
    }

  };

  const handleNumberClick = (number) => {
    if (number !== null && userID.length && roomID.length) {
      console.log("clicked number ", number, userID, roomID);
      
      // Check if the number is in called numbers from localStorage
      const calledNumbers = localStorageService.getCalledNumbers(roomID);
      
      if (calledNumbers.includes(number)) {
        // Add to struck numbers in localStorage before emitting to server
        const newStruckNumbers = [...struckNumbers, number];
        localStorageService.saveStruckNumbers(newStruckNumbers, roomID, userID);
        
        // Emit to server to synchronize with other players
        socket.emit('struckNumber', { number: number, userName: userID, room: roomID });
      }
    }
  }

  const convertTicketFormat = (originalTicket) => {
    let finalTicket = []
    for (let rows = 0; rows < 3; rows++) {
      let row = []
      for (let columns = 0; columns < 9; columns++) {
        row.push(originalTicket[columns][rows])
      }
      finalTicket.push(row)
    }
    setTicket(finalTicket)
  }
  console.log("struckNumber", struckNumbers)
  console.log("ticket", ticket)

  useEffect(() => {
    if (claimed.length > 0) {
      let key = `claimed_${claimed.length}`
      setSearchParams({ ...Object.fromEntries([...searchParams]), [key]: claimed[claimed.length - 1] })
      if (claimed.length === 12) {
        setAllCategoriesClaimed(true)
      }
    }
  }, [claimed])
  console.log("claimed", claimed)

  // Save ticket to localStorage when it changes
  useEffect(() => {
    if (ticket.length > 0 && roomID && userID) {
      localStorageService.saveTicket(ticket, roomID, userID);
    }
  }, [ticket, roomID, userID]);
  
  // Save struck numbers to localStorage when they change
  useEffect(() => {
    if (struckNumbers.length > 0 && roomID && userID) {
      localStorageService.saveStruckNumbers(struckNumbers, roomID, userID);
    }
  }, [struckNumbers, roomID, userID]);
  
  // Save claimed categories to localStorage when they change
  useEffect(() => {
    if (claimedCategories.length > 0 && roomID) {
      localStorageService.saveClaimedCategories(claimedCategories, roomID);
    }
  }, [claimedCategories, roomID]);
  
  useEffect(() => {
    socket.on('struckNumber', struckNumberResponse => {
      console.log("inside socket struck numbers", struckNumberResponse)
      if (struckNumberResponse.userName === userID) {
        setStruckNumbers(prevStruckNumbers => {
          const newStruckNumbers = [...prevStruckNumbers, struckNumberResponse?.number];
          // Save to localStorage
          localStorageService.saveStruckNumbers(newStruckNumbers, roomID, userID);
          return newStruckNumbers;
        });
      }
    });
    socket.on('private', userTicket => {
      console.log("inside socket ticket", userTicket);
      
      if (userTicket.userName === userID) {
        // Check if we should use the stored ticket or the new one
        if (userTicket.useStoredTicket) {
          console.log("Using stored ticket from localStorage");
          // We keep using the ticket loaded from localStorage in the useState initialization
          // No need to call convertTicketFormat as we already have the ticket in the right format
        } else if (userTicket.numbers) {
          console.log("Using new ticket from server");
          convertTicketFormat(userTicket.numbers);
        }
      }
      
      // Save called numbers to localStorage if they exist
      if (userTicket.calledNumbers && userTicket.calledNumbers.length > 0) {
        localStorageService.saveCalledNumbers(userTicket.calledNumbers, roomID);
        setCalledNumbers(userTicket.calledNumbers);
        if (userTicket.calledNumbers.length > 0) {
          setLastCalledNumber(userTicket.calledNumbers[userTicket.calledNumbers.length - 1]);
        }
      }
      
      setAllUsers(userTicket.allUsers);
      setHost(userTicket.allUsers[0]?.userName);
    });
    socket.on('category', categoryAndScores => {
      console.log("inside socket categoryAndScores", categoryAndScores)
      setAllUsers(categoryAndScores.allUsers);
      
      const newClaimedCategories = categoryAndScores.categoryCard.category
        .filter((item) => item.claimed === true)
        .map((item) => item.category);
      
      setClaimedCategories(newClaimedCategories);
      
      // Save claimed categories to localStorage
      localStorageService.saveClaimedCategories(newClaimedCategories, roomID);
      
      if (categoryAndScores.userName === userID) {
        const userClaimed = categoryAndScores?.scoreCategory?.map((item) => item.category);
        setClaimed(userClaimed);
      }
    });
    
    socket.on('calledNumber', calledNumbers => {
      // Save called numbers to localStorage
      if (calledNumbers && calledNumbers.length > 0) {
        localStorageService.saveCalledNumbers(calledNumbers, roomID);
        setCalledNumbers(calledNumbers);
        setLastCalledNumber(calledNumbers[calledNumbers.length - 1]);
        
        // Auto-strike the called number if it's in the ticket
        const lastNumber = calledNumbers[calledNumbers.length - 1];
        if (lastNumber) {
          // Check if the number is in the ticket and not already struck
          const isInTicket = ticket.some(row => row.includes(lastNumber));
          if (isInTicket && !struckNumbers.includes(lastNumber)) {
            const updatedStruckNumbers = [...struckNumbers, lastNumber];
            setStruckNumbers(updatedStruckNumbers);
            localStorageService.saveStruckNumbers(updatedStruckNumbers, roomID, userID);
          }
        }
      }
    });
    
    socket.on('join', joinResponse => {
      // Save called numbers to localStorage if they exist
      if (joinResponse.calledNumbers && joinResponse.calledNumbers.length > 0) {
        localStorageService.saveCalledNumbers(joinResponse.calledNumbers, roomID);
        setCalledNumbers(joinResponse.calledNumbers);
        if (joinResponse.calledNumbers.length > 0) {
          setLastCalledNumber(joinResponse.calledNumbers[joinResponse.calledNumbers.length - 1]);
        }
      }
    });
  }, [socket, userID, roomID, ticket, struckNumbers]);
  
  useEffect(() => {
    setClaimedCategories([])
    if (Object.keys(Object.fromEntries([...searchParams])).some(str => str.includes("claimed"))) {
      let allClaimed = Object.keys(Object.fromEntries([...searchParams])).filter(str => str.includes("claimed"))
      setClaimed(allClaimed.map(key => Object.fromEntries([...searchParams])[key]))
    }
    console.log("inside [useffect", userID, roomID)
    
    if (userID.length && roomID.length) {
      // Check if we already have a ticket in localStorage
      const storedTicket = localStorageService.getTicket(roomID, userID);
      const hasStoredTicket = storedTicket && storedTicket.length > 0;
      
      console.log("Checking for stored ticket:", hasStoredTicket ? "Found" : "Not found");
      
      // Send hasStoredTicket flag to the server
      socket.emit('getTicket', { 
        userName: userID, 
        room: roomID,
        hasStoredTicket: hasStoredTicket
      });
    }
  }, [userID, roomID, userJoined]);

  return (
    <div>
      {lastCalledNumber && (
        <div className="last-called-number">
          <h3>Last Called Number: <span className="number-highlight">{lastCalledNumber}</span></h3>
        </div>
      )}
      {/* <div className="called-numbers-container">
        <h4>Called Numbers:</h4>
        <div className="called-numbers-list">
          {calledNumbers.map((number, index) => (
            <span key={index} className="called-number">{number}</span>
          ))}
        </div>
      </div> */}
      <div className="ticket-display">
        {ticket.map((row, rowIndex) => (
          <div className="ticket-row" key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <div
                className={`ticket-cell ${cell === null ? 'empty' : ''}`}
                key={`${rowIndex}-${cellIndex}`}
                onClick={() => handleNumberClick(cell)}
                style={struckNumbers.includes(cell) ? { textDecoration: 'line-through', backgroundColor: "#D4F4E8" } : {}}
              >
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div>
        <h2 style={{ display: "flex", justifyContent: "center", marginBottom: "12px", marginTop: "30px" }}>Score Categories</h2>
        {showNotification && (
          <div className="notification">
            Invalid Claim
          </div>
        )}
        <div className="score-category-list">
          {scoreCategories.map((category, index) => (
            <div key={index} className="score-category" style={claimedCategories.includes(category.category) ? { backgroundColor: "#737272" } : {}}>
              <div className="category" style={claimedCategories.includes(category.category) ? { color: "white" } : {}}>{category.displayName}</div>
              <div className="score" style={claimedCategories.includes(category.category) ? { color: "white" } : {}}>{category.score}</div>
              <div className="info-icon">
                <FontAwesomeIcon icon={faInfoCircle} />
                <div className="tooltip">{category.description}</div>
              </div>
              <button
                className={`chip ${claimedCategories.includes(category.category) ? 'disabled' : ''}`}
                disabled={claimedCategories.includes(category.category) || disabledButtons.includes(category.category)}
                onClick={() => handleChipClick(category.category)}
              >
                {claimedCategories.includes(category.category) ? 'Claimed' : 'Claim'}
              </button>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TicketDisplay;
