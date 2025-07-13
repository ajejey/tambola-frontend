import React from 'react'
import './PrivacyPolicy.css'
import Background from '../Background/Background'
import Header from '../Header/Header'
import { useNavigate } from 'react-router-dom'

export default function PrivacyPolicy() {
    const navigate = useNavigate()

    const handleBackToHome = () => {
        navigate("/")
    }

    return (
        <div>
            <Background />
            <Header />
            <div className="privacy-policy-container">
                <h1>Privacy Policy</h1>
                <div className="privacy-policy-content">
                    <section>
                        <h2>1. Introduction</h2>
                        <p>Welcome to Tambola! This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our online tambola game service.</p>
                        <p>We respect your privacy and are committed to protecting your personal data. Please read this privacy policy carefully to understand our policies and practices.</p>
                    </section>

                    <section>
                        <h2>2. Information We Collect</h2>
                        <p>We may collect several types of information from and about users of our website, including:</p>
                        <ul>
                            <li>Personal identifiers such as name or username that you provide when using our service</li>
                            <li>Technical data including internet protocol (IP) address, browser type and version, time zone setting, browser plug-in types and versions, operating system and platform</li>
                            <li>Usage data including information about how you use our website and services</li>
                        </ul>
                    </section>

                    <section>
                        <h2>3. How We Use Your Information</h2>
                        <p>We use information that we collect about you or that you provide to us:</p>
                        <ul>
                            <li>To provide, maintain, and improve our services</li>
                            <li>To personalize your experience</li>
                            <li>To communicate with you about updates or changes to our service</li>
                            <li>To monitor and analyze usage patterns and trends</li>
                        </ul>
                    </section>

                    <section>
                        <h2>4. Data Security</h2>
                        <p>We have implemented measures designed to secure your personal information from accidental loss and from unauthorized access, use, alteration, and disclosure.</p>
                        <p>However, the transmission of information via the internet is not completely secure. While we do our best to protect your personal information, we cannot guarantee the security of your personal information transmitted to our website.</p>
                    </section>

                    <section>
                        <h2>5. Third-Party Services</h2>
                        <p>We may use third-party services that collect, monitor, and analyze this type of information in order to increase our service's functionality. These third-party service providers have their own privacy policies addressing how they use such information.</p>
                    </section>

                    <section>
                        <h2>6. Children's Privacy</h2>
                        <p>Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.</p>
                    </section>

                    <section>
                        <h2>7. Changes to Our Privacy Policy</h2>
                        <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.</p>
                        <p>You are advised to review this Privacy Policy periodically for any changes.</p>
                    </section>

                    <section>
                        <h2>8. Contact Us</h2>
                        <p>If you have any questions about this Privacy Policy, please contact us at:</p>
                        <p>Email: support@tambola-game.com</p>
                    </section>

                    <p className="last-updated">Last Updated: May 3, 2025</p>
                </div>
                <button className="back-button" onClick={handleBackToHome}>Back to Home</button>
            </div>
        </div>
    )
}
