import React from 'react'
import './TermsOfService.css'
import Background from '../Background/Background'
import Header from '../Header/Header'
import { useNavigate } from 'react-router-dom'

export default function TermsOfService() {
    const navigate = useNavigate()

    const handleBackToHome = () => {
        navigate("/")
    }

    return (
        <div>
            <Background />
            <Header />
            <div className="terms-of-service-container">
                <h1>Terms of Service</h1>
                <div className="terms-of-service-content">
                    <section>
                        <h2>1. Acceptance of Terms</h2>
                        <p>Welcome to Tambola! These Terms of Service ("Terms") govern your access to and use of our website and services. By accessing or using our service, you agree to be bound by these Terms.</p>
                        <p>If you do not agree to these Terms, please do not use our service.</p>
                    </section>

                    <section>
                        <h2>2. Description of Service</h2>
                        <p>Tambola provides an online platform for playing the traditional game of Tambola (also known as Housie or Bingo). Our service allows users to create and join game rooms, generate tickets, and play the game with other users.</p>
                    </section>

                    <section>
                        <h2>3. User Accounts</h2>
                        <p>To use certain features of our service, you may need to provide a username. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.</p>
                        <p>You agree to provide accurate and complete information when using our service and to update your information to keep it accurate and complete.</p>
                    </section>

                    <section>
                        <h2>4. User Conduct</h2>
                        <p>You agree not to use our service to:</p>
                        <ul>
                            <li>Violate any applicable laws or regulations</li>
                            <li>Impersonate any person or entity</li>
                            <li>Engage in any activity that interferes with or disrupts the service</li>
                            <li>Attempt to gain unauthorized access to any portion of the service</li>
                            <li>Use the service for any illegal or unauthorized purpose</li>
                        </ul>
                    </section>

                    <section>
                        <h2>5. Intellectual Property</h2>
                        <p>All content included on the website, such as text, graphics, logos, images, and software, is the property of Tambola or its content suppliers and is protected by copyright and other intellectual property laws.</p>
                        <p>You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our website without our prior written consent.</p>
                    </section>

                    <section>
                        <h2>6. Disclaimer of Warranties</h2>
                        <p>Our service is provided on an "as is" and "as available" basis. We make no warranties, expressed or implied, regarding the operation of our service or the information, content, materials, or products included on our website.</p>
                        <p>We do not warrant that our service will be uninterrupted or error-free, that defects will be corrected, or that our website or the server that makes it available are free of viruses or other harmful components.</p>
                    </section>

                    <section>
                        <h2>7. Limitation of Liability</h2>
                        <p>In no event will we be liable for any damages, including without limitation, direct, indirect, incidental, special, consequential, or punitive damages arising out of the use of or inability to use our service.</p>
                    </section>

                    <section>
                        <h2>8. Changes to Terms</h2>
                        <p>We reserve the right to modify these Terms at any time. We will notify users of any changes by updating the "Last Updated" date of these Terms.</p>
                        <p>Your continued use of our service following the posting of changes constitutes your acceptance of such changes.</p>
                    </section>

                    <section>
                        <h2>9. Governing Law</h2>
                        <p>These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which we operate, without regard to its conflict of law provisions.</p>
                    </section>

                    <section>
                        <h2>10. Contact Information</h2>
                        <p>If you have any questions about these Terms, please contact us at:</p>
                        <p>Email: support@tambola-game.com</p>
                    </section>

                    <p className="last-updated">Last Updated: May 3, 2025</p>
                </div>
                <button className="back-button" onClick={handleBackToHome}>Back to Home</button>
            </div>
        </div>
    )
}
