import React from 'react';
import './TicketInfo.css';

// const prizeExamples = {
//   'Early Five': [
//     [1, 0, 0, 0, 0, 1, 0, 0, 0],
//     [0, 0, 0, 1, 0, 0, 0, 0, 0],
//     [0, 1, 0, 0, 0, 1, 0, 0, 0],
//   ],
//   'Top Row': [
//     [1, 1, 1, 1, 1, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   ],
//   'Middle Row': [
//     [0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [1, 1, 1, 1, 1, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   ],
//   'Bottom Row': [
//     [0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [1, 1, 1, 1, 1, 0, 0, 0, 0],
//   ],
//   'All Corners': [
//     [1, 0, 0, 0, 0, 0, 0, 0, 1],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [1, 0, 0, 0, 0, 0, 0, 0, 1],
//   ],
//   'Full House': [
//     [1, 1, 1, 1, 1, 0, 0, 0, 0],
//     [1, 1, 1, 1, 1, 0, 0, 0, 0],
//     [1, 1, 1, 1, 1, 0, 0, 0, 0],
//   ],
// };

const prizeExamples = [
  {
    prize: 'Early Five',
    layout: [
      [1, 0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0, 0],
      [0, 1, 0, 0, 0, 1, 0, 0, 0],
    ],
    description: 'Any 5 numbers'
  },
  {
    prize: 'Top Row',
    layout: [
      [1, 0, 1, 0, 1, 0, 1, 0, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ],
    description: 'All numbers in the top row'
  },
  {
    prize: 'Middle Row',
    layout: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 0, 1, 0, 1, 0, 1, 0, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ],
    description: 'All numbers in the middle row'
  },
  {
    prize: 'Bottom Row',
    layout: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 0, 1, 0, 1, 0, 1, 0, 1],
    ],
    description: 'All numbers in the bottom row'
  },
  {
    prize: 'All Corners',
    layout: [
      [1, 0, 0, 0, 0, 0, 0, 0, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0, 0, 0, 0, 1],
    ],
    description: 'All numbers in the corners. Can be the first and last number in the first and last row'
  },
  {
    prize: 'Full House',
    layout: [
      [1, 0, 1, 0, 1, 0, 1, 0, 1],
      [0, 1, 0, 1, 0, 1, 0, 1, 1],
      [1, 0, 1, 0, 1, 0, 1, 0, 1],
    ],
    description: 'All numbers in the ticket'
  },
]
const TicketInfo = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {prizeExamples.map((prizeExample) => (
        <div key={prizeExample.prize} className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <h4 className="text-lg font-semibold text-gray-800 mb-3">{prizeExample.prize}</h4>
          <div className="grid grid-rows-3 gap-1">
            {prizeExample.layout.map((row, i) => (
              <div key={i} className="grid grid-cols-9 gap-1">
                {row.map((cell, j) => (
                  <div
                    key={j}
                    className={`w-full aspect-square rounded-sm ${
                      cell === 1 ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  ></div>
                ))}
              </div>
            ))}
          </div>
          <p className="text-gray-600 mt-2">{prizeExample.description}</p>
        </div>
      ))}
    </div>
  );
};

export default TicketInfo;
