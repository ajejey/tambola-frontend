import React, { useState } from 'react'
import './FAQ.css'
import Background from '../Background/Background'
import Header from '../Header/Header'

export default function FAQ() {
    const [activeIndex, setActiveIndex] = useState(null)

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index)
    }

    const faqItems = [
        {
            question: "What is Tambola?",
            answer: "Tambola, also known as Housie or Bingo, is a game of chance where players mark off numbers on their tickets as they are called out randomly. The objective is to complete specific patterns on the ticket before other players."
        },
        {
            question: "How do I play Tambola online?",
            answer: "To play Tambola online on our platform, simply enter your name, then either create a new room or join an existing room using a room code. Once in a room, you'll receive a ticket with numbers, and as numbers are called, you can mark them off on your ticket."
        },
        {
            question: "How are the numbers generated?",
            answer: "Numbers in our online Tambola game are generated using a random number generator to ensure fair play. Each number from 1 to 90 has an equal chance of being selected."
        },
        {
            question: "Can I play Tambola on mobile devices?",
            answer: "Yes, our Tambola platform is fully responsive and works on all devices including smartphones, tablets, and desktop computers."
        },
        {
            question: "How many players can join a single game?",
            answer: "There is no strict limit on the number of players who can join a single game. However, for the best experience, we recommend having between 2 to 20 players in a room."
        },
        {
            question: "Can I create multiple rooms?",
            answer: "Yes, you can create multiple rooms. Each room has a unique code that you can share with others to invite them to join your specific game."
        },
        {
            question: "What happens if I lose my internet connection during a game?",
            answer: "If you lose your connection during a game, you can rejoin the same room using the room code. Your ticket and marked numbers will be restored as long as the game is still in progress."
        },
        {
            question: "Are there different winning patterns?",
            answer: "Yes, Tambola can be played with various winning patterns such as Early Five (first to mark 5 numbers), Top Line, Middle Line, Bottom Line, and Full House (all numbers marked). The host of the room typically announces which patterns are being played for."
        },
        {
            question: "Is there a time limit for marking numbers?",
            answer: "No, there is no strict time limit for marking numbers. However, to keep the game flowing, we encourage players to mark their numbers promptly."
        },
        {
            question: "How do I claim a win?",
            answer: "When you complete a winning pattern, you should announce it in the game chat. The host or other players can verify your claim by checking your ticket against the called numbers."
        }
    ]

    return (
        <div>
            <Background />
            <Header />
            <div className="faq-container">
                <h1>Frequently Asked Questions</h1>
                <div className="faq-content">
                    <div className="faq-list">
                        {faqItems.map((item, index) => (
                            <div 
                                key={index} 
                                className={`faq-item ${activeIndex === index ? 'active' : ''}`}
                            >
                                <div 
                                    className="faq-question" 
                                    onClick={() => toggleFAQ(index)}
                                >
                                    <h3>{item.question}</h3>
                                    <span className="faq-icon">
                                        {activeIndex === index ? '−' : '+'}
                                    </span>
                                </div>
                                <div className={`faq-answer ${activeIndex === index ? 'active' : ''}`}>
                                    <p>{item.answer}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="additional-help">
                        <h2>Still Have Questions?</h2>
                        <p>If you couldn't find the answer to your question, please feel free to contact us. We're here to help!</p>
                        <a href="/contact" className="contact-link">Contact Us</a>
                    </div>
                </div>
            </div>
        </div>
    )
}
