import React, { useState, useEffect } from 'react';
import './MoreGames.css';

function MoreGames() {
  const [isVisible, setIsVisible] = useState(false);
  
  // Add a slight delay before showing the component for a nice fade-in effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  const games = [
    {
      name: "Emoji Guess Game",
      url: "https://emoji-guess-game-seven.vercel.app/",
      description: "Multiplayer game where you guess movies, phrases, or concepts from emojis!",
      isNew: true
    },
    {
      name: "Herd Game",
      url: "https://herdgame.vercel.app",
      description: "Multiplayer game where you think like the herd! Match your answers with other players to score points",
      isNew: true
    }
  ];

  return (
    <div className={`more-games-container ${isVisible ? 'fade-in' : ''}`}>
      <h2>More Games by Creator</h2>
      <div className="games-grid">
        {games.map((game, index) => (
          <a 
            key={index} 
            href={game.url} 
            target="_blank" 
            rel="noreferrer" 
            className="game-card"
          >
            {game.isNew && <span className="new-badge">NEW</span>}
            <h3>{game.name}</h3>
            <p>{game.description}</p>
            <span className="play-now">Play Now →</span>
          </a>
        ))}
      </div>
    </div>
  );
}

export default MoreGames;
