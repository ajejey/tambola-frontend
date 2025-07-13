import React from 'react'
import './AboutUs.css'
import Background from '../Background/Background'
import Header from '../Header/Header'

export default function AboutUs() {
    return (
        <div>
            <Background />
            <Header />
            <div className="about-us-container">
                <h1>About Us</h1>
                <div className="about-us-content">
                    <section>
                        <h2>Our Story</h2>
                        <p>Welcome to Tambola, an online platform dedicated to bringing the joy and excitement of the traditional Tambola (Housie/Bingo) game to the digital world. Our journey began with a simple idea: to create a virtual space where friends and family can gather and enjoy this beloved game regardless of physical distance.</p>
                        <p>Developed by a small team of passionate developers, Tambola aims to preserve the authentic experience of the game while making it accessible to everyone with an internet connection.</p>
                    </section>

                    <section>
                        <h2>Our Mission</h2>
                        <p>Our mission is to provide a user-friendly, engaging, and fair platform for playing Tambola online. We strive to create an environment that fosters community, fun, and the thrill of the game.</p>
                        <p>We believe that games have the power to bring people together, and Tambola has been doing just that for generations. By bringing this classic game online, we hope to continue this tradition in the digital age.</p>
                    </section>

                    <section>
                        <h2>What Makes Us Different</h2>
                        <p>Unlike many other online gaming platforms, Tambola focuses on simplicity and accessibility. We've designed our platform to be intuitive and easy to use, ensuring that players of all ages and technical abilities can enjoy the game.</p>
                        <p>Our commitment to fair play means that we use a truly random number generator for calling numbers, ensuring that every game is unpredictable and exciting.</p>
                    </section>

                    <section>
                        <h2>Looking Forward</h2>
                        <p>As we continue to grow, we're always looking for ways to improve and enhance the Tambola experience. We value feedback from our community and are committed to regularly updating and refining our platform.</p>
                        <p>Thank you for being a part of our journey. We hope you enjoy playing Tambola as much as we enjoyed creating it!</p>
                    </section>
                </div>
            </div>
        </div>
    )
}
