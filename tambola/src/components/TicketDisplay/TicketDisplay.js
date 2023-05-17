import React, { useState, useEffect } from 'react';
import './ticketDisplay.css';
// import io from 'socket.io-client';

// const socket = io('http://localhost:5000');

function TicketDisplay() {
  const [ticket, setTicket] = useState([]);

  // Listen for updates to the ticket array from the server
  useEffect(() => {
    // socket.on('ticket', (newTicket) => {
    //   setTicket(newTicket);
    // });
    setTicket([[1,null,25, 31, null, 57, 77, null, null], [null, 17, null, 37, null, 58, null, 78, 81], [4, null, 28, null, 46, null, 65, null, 85]])
  }, []);

  return (
    <div className="ticket-display">
    {ticket.map((row, rowIndex) => (
      <div className="ticket-row" key={rowIndex}>
        {row.map((cell, cellIndex) => (
          <div
            className={`ticket-cell ${cell === null ? 'empty' : ''}`}
            key={`${rowIndex}-${cellIndex}`}
          >
            {cell}
          </div>
        ))}
      </div>
    ))}
  </div>
  );
}

export default TicketDisplay;
