import React, { useState, useEffect } from 'react';
import './ticketDisplay.css';
import { useContext } from 'react';
import { GlobalContext } from '../../context/Provider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { scoreCategories } from '../../constants/constants';
import { useSearchParams } from 'react-router-dom';

function TicketDisplay() {
  const { roomID, userID, setAllUsers, setHost, setAllCategoriesClaimed, userJoined, socket } = useContext(GlobalContext)
  const [ticket, setTicket] = useState([]);
  const [struckNumbers, setStruckNumbers] = useState([])
  const [claimedCategories, setClaimedCategories] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  let [searchParams, setSearchParams] = useSearchParams();
  const [claimed, setClaimed] = useState([])
  const [disabledButtons, setDisabledButtons] = useState([]);

  const checkClaimedCategory = (claimedCategory) => {
    let claimIsValid = false
    let struckNumbersCopy = [...new Set(struckNumbers)]
    if (ticket.length) {
      switch (claimedCategory) {
        case 'EARLY_FIVE':
          if (struckNumbersCopy.length >= 5) {
            claimIsValid = true
          }
          break;
        case 'EARLY_SEVEN':
          if (struckNumbersCopy.length >= 7) {
            claimIsValid = true
          }
          break;
        case 'MIDDLE_NUMBER':
          let middleNumber = ticket[1].filter((num) => num !== null)[2]
          if (struckNumbersCopy.includes(middleNumber)) {
            claimIsValid = true
          }
          break;
        case 'FIRST_LINE':
          let firstLineNumbers = ticket[0].filter((num) => num !== null)
          if (firstLineNumbers.every((number) => struckNumbersCopy.includes(number))) {
            claimIsValid = true
          }
          break;
        case 'MIDDLE_LINE':
          let midLineNumbers = ticket[1].filter((num) => num !== null)
          if (midLineNumbers.every((number) => struckNumbersCopy.includes(number))) {
            claimIsValid = true
          }
          break;
        case 'LAST_LINE':
          let lastLineNumbers = ticket[2].filter((num) => num !== null)
          if (lastLineNumbers.every((number) => struckNumbersCopy.includes(number))) {
            claimIsValid = true
          }
          break;
        case 'CORNERS_1':
          if (!claimed.includes("CORNERS_2")) {
            let firstLineNumFirst_corner1 = ticket[0].filter((num) => num !== null)[0]
            let firstLineNumFifth_corner1 = ticket[0].filter((num) => num !== null)[4]
            let lastLineNumFirst_corner1 = ticket[2].filter((num) => num !== null)[0]
            let lastLineNumFifth_corner1 = ticket[2].filter((num) => num !== null)[4]
            let arrayTocheck_corner1 = [firstLineNumFirst_corner1, firstLineNumFifth_corner1, lastLineNumFirst_corner1, lastLineNumFifth_corner1]
            if (arrayTocheck_corner1.every((number) => struckNumbersCopy.includes(number))) {
              claimIsValid = true
            }
          }
          break;
        case 'CORNERS_2':
          if (!claimed.includes("CORNERS_1")) {
            let firstLineNumFirst_corner2 = ticket[0].filter((num) => num !== null)[0]
            let firstLineNumFifth_corner2 = ticket[0].filter((num) => num !== null)[4]
            let lastLineNumFirst_corner2 = ticket[2].filter((num) => num !== null)[0]
            let lastLineNumFifth_corner2 = ticket[2].filter((num) => num !== null)[4]
            let arrayTocheck_corner2 = [firstLineNumFirst_corner2, firstLineNumFifth_corner2, lastLineNumFirst_corner2, lastLineNumFifth_corner2]
            if (arrayTocheck_corner2.every((number) => struckNumbersCopy.includes(number))) {
              claimIsValid = true
            }
          }
          break;
        case 'STAR_1':
          if (!claimed.includes("STAR_2")) {
            let firstLineNumFirst_star1 = ticket[0].filter((num) => num !== null)[0]
            let firstLineNumFifth_star1 = ticket[0].filter((num) => num !== null)[4]
            let lastLineNumFirst_star1 = ticket[2].filter((num) => num !== null)[0]
            let lastLineNumFifth_star1 = ticket[2].filter((num) => num !== null)[4]
            let middleNumber_star1 = ticket[1].filter((num) => num !== null)[2]
            let arrayTocheck_star1 = [firstLineNumFirst_star1, firstLineNumFifth_star1, lastLineNumFirst_star1, lastLineNumFifth_star1, middleNumber_star1]
            if (arrayTocheck_star1.every((number) => struckNumbersCopy.includes(number))) {
              claimIsValid = true
            }
          }
          break;
        case 'STAR_2':
          if (!claimed.includes("STAR_1")) {
            let firstLineNumFirst_star2 = ticket[0].filter((num) => num !== null)[0]
            let firstLineNumFifth_star2 = ticket[0].filter((num) => num !== null)[4]
            let lastLineNumFirst_star2 = ticket[2].filter((num) => num !== null)[0]
            let lastLineNumFifth_star2 = ticket[2].filter((num) => num !== null)[4]
            let middleNumber_star2 = ticket[1].filter((num) => num !== null)[2]
            let arrayTocheck_star2 = [firstLineNumFirst_star2, firstLineNumFifth_star2, lastLineNumFirst_star2, lastLineNumFifth_star2, middleNumber_star2]
            if (arrayTocheck_star2.every((number) => struckNumbersCopy.includes(number))) {
              claimIsValid = true
            }
          }
          break;
        case 'FULL_HOUSE_1':
          if (!claimed.includes("FULL_HOUSE_2")) {
            if (ticket.flat().filter(num => num !== null).every(num => struckNumbersCopy.includes(num))) {
              claimIsValid = true
            }
          }
          break;
        case 'FULL_HOUSE_2':
          if (!claimed.includes("FULL_HOUSE_1")) {
            if (ticket.flat().filter(num => num !== null).every(num => struckNumbersCopy.includes(num))) {
              claimIsValid = true
            }
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
      console.log("clicked number ", number, userID, roomID)
      socket.emit('struckNumber', { number: number, userName: userID, room: roomID })
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

  useEffect(() => {
    socket.on('struckNumber', struckNumberResponse => {
      console.log("inside socket struck numbers", struckNumberResponse)
      if (struckNumberResponse.userName === userID) {
        setStruckNumbers(prevStruckNumbers => [...prevStruckNumbers, struckNumberResponse?.number]);
      }
    });
    socket.on('private', userTicket => {
      console.log("inside socket ticket {userName,numbers,allUserNames}", userTicket);
      if (userTicket.userName === userID) {
        convertTicketFormat(userTicket.numbers)
      }
      setAllUsers(userTicket.allUsers)
      setHost(userTicket.allUsers[0]?.userName)
    });
    socket.on('category', categoryAndScores => {
      console.log("inside socket categoryAndScores", categoryAndScores)
      setAllUsers(categoryAndScores.allUsers)
      setClaimedCategories(categoryAndScores.categoryCard.category.filter((item) => item.claimed === true).map((item) => item.category))
      if (categoryAndScores.userName === userID) {
        setClaimed(categoryAndScores?.scoreCategory?.map((item) => item.category));
      }
    });
    // socket.on('error', errorMessage => {
    //   console.log("getTicket error", errorMessage)
    // });
  }, [socket])

  useEffect(() => {
    setClaimedCategories([])
    if (Object.keys(Object.fromEntries([...searchParams])).some(str => str.includes("claimed"))) {
      let allClaimed = Object.keys(Object.fromEntries([...searchParams])).filter(str => str.includes("claimed"))
      setClaimed(allClaimed.map(key => Object.fromEntries([...searchParams])[key]))
    }
    console.log("inside [useffect", userID, roomID)
    if (userID.length && roomID.length) {
      socket.emit('getTicket', { userName: userID, room: roomID })
    }
  }, [userID, roomID, userJoined]);

  return (
    <div>
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
