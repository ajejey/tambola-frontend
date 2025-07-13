import React from 'react';
import { motion } from 'framer-motion';

const Board = ({ board, currentNumber }) => {
  return (
    <div className="bg-gray-100 rounded-lg p-4 shadow-md max-w-max mx-auto">
      <h3 className="text-2xl font-bold text-center mb-4">Tambola Board</h3>
      <div className="grid grid-cols-10 gap-2">
        {board.map((called, i) => {
          const number = i + 1;
          const isCurrent = number === currentNumber;

          return (
            <motion.div
              key={i}
              className={`flex p-2 md:p-4 items-center justify-center w-full h-full aspect-square rounded-md text-lg font-semibold transition-all duration-300 ${
                called ? 'bg-green-500 text-white scale-105 shadow-lg' : 'bg-white text-gray-700'
              }`}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9, rotate: -5 }}
              animate={isCurrent ? { 
                scale: [1, 2, 1],
                transition: { 
                  duration: 0.6,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatDelay: 0.5
                } 
              } : {}}
            >
              {number}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Board;