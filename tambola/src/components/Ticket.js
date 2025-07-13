import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const StrikingSVG = () => (
  <motion.svg
    className="absolute w-full h-full"
    viewBox="0 0 50 50"
    initial={{ pathLength: 0 }}
    animate={{ pathLength: 1 }}
    exit={{ pathLength: 0 }}
    transition={{ delay: 0.3, duration: 0.5, ease: "easeInOut" }}
  >
    <motion.line
      x1="5"
      y1="45"
      x2="45"
      y2="5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </motion.svg>
);

const Ticket = ({ ticket, numbersCalled, struckNumbers, onNumberClick }) => {
  if (!ticket) {
    return (
      <div className="bg-gray-100 rounded-lg p-4 shadow-md flex items-center justify-center h-48">
        <p className="text-gray-500 italic">Waiting for ticket...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 rounded-lg p-4 shadow-md max-w-max mx-auto">
      <h3 className="text-2xl font-bold text-center mb-4">Your Ticket</h3>
      <div className="grid grid-rows-3 gap-2">
        {ticket.map((row, i) => (
          <div key={i} className="grid grid-cols-9 gap-2">
            {row.map((num, j) => {
              const isCalled = numbersCalled.includes(num);
              const isStruck = struckNumbers && struckNumbers.includes(num);
              return (
                <motion.div
                  key={j}
                  onClick={() => onNumberClick && onNumberClick(num)}
                  className={`relative flex p-2 md:p-4 items-center justify-center w-full h-full aspect-square rounded-md text-lg font-bold transition-all duration-300 ${
                    num === null
                      ? 'bg-gray-200'
                      : isStruck
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-800'
                  } ${onNumberClick ? 'cursor-pointer' : ''}`}
                >
                  {num}
                  <AnimatePresence>
                    {isStruck && (
                      <div className="absolute w-full h-full text-red-500">
                        <StrikingSVG />
                      </div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ticket;