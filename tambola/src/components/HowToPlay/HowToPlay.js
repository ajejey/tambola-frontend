import React from 'react'
import './howToPlay.css'
import MoreGames from '../MoreGames/MoreGames'

function HowToPlay() {
    return (
        <div className="how-to-play-container">
            <MoreGames />
            <h2>How to Play Tambola</h2>

            <h3>Objective:</h3>
            <p>The objective of Tambola is to mark off numbers on your ticket as they are called out, in order to achieve a specific pattern or combination.</p>

            <h3>Tickets:</h3>
            <p>Each player will have a ticket with a grid of numbers on it. The numbers range from 1 to 90 and are arranged in a random order across the ticket.</p>

            <h3>Number Calling:</h3>
            <p>A caller randomly selects numbers from 1 to 90 and announces them one by one. The players will mark off the numbers on their respective tickets if they appear.</p>

            <h3>Patterns:</h3>
            <p>The game can have various patterns to achieve a win. Some common patterns include a full house (all numbers marked off), a top line (all numbers in the top row marked off), a middle line (all numbers in the middle row marked off), a bottom line (all numbers in the bottom row marked off), and many more.</p>

            <h3>Winning:</h3>
            <p>The game continues until a player achieves the announced pattern. The first player to achieve the pattern must claim the win.</p>

            <h3>Etiquette:</h3>
            <p>Please maintain fair play and follow the rules of the game. Avoid any form of cheating or tampering with the tickets. Show respect to other players and the caller.</p>

            <h3>Enjoy the Game:</h3>
            <p>Tambola is a fun and exciting game of chance. Relax, have fun, and enjoy the thrill of marking off the numbers as you get closer to achieving the winning pattern.</p>

            <br />

            <div style={{ textAlign: "center"}}>
                <p>Created By</p>
                <a style={{ textDecoration: "none", color: "inherit"}} href='https://www.linkedin.com/in/radhika-priyavardhini-0683871b5/'  target="_blank" rel="noreferrer">Radhika Priyavardhini</a>
                <br />
                <a style={{ textDecoration: "none", color: "inherit"}} href='https://www.linkedin.com/in/ajey-nagarkatti-28273856/' target="_blank" rel="noreferrer">Ajey Nagarkatti</a>
            </div>
            
        </div>
    )
}

export default HowToPlay