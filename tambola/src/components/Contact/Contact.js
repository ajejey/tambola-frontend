import React, { useState } from 'react'
import './Contact.css'
import Background from '../Background/Background'
import Header from '../Header/Header'

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    })
    const [formSubmitted, setFormSubmitted] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // In a real application, you would send this data to a server
        console.log('Form submitted:', formData)
        setFormSubmitted(true)
        // Reset form after submission
        setFormData({
            name: '',
            email: '',
            message: ''
        })
    }

    return (
        <div>
            <Background />
            <Header />
            <div className="contact-container">
                <h1>Contact Us</h1>
                <div className="contact-content">
                    <div className="contact-info">
                        <h2>Get in Touch</h2>
                        <p>Have questions, suggestions, or feedback? We'd love to hear from you!</p>
                        <p>Email us at: <a href="mailto:ajejey@gmail.com">ajejey@gmail.com</a></p>
                        
                        <div className="team-section">
                            <h3>Our Team</h3>
                            <div className="team-member">
                                <p>Radhika Priyavardhini</p>
                                <a href="https://www.linkedin.com/in/radhika-priyavardhini-0683871b5/" target="_blank" rel="noreferrer">LinkedIn Profile</a>
                            </div>
                            <div className="team-member">
                                <p>Ajey Nagarkatti</p>
                                <a href="https://www.linkedin.com/in/ajey-nagarkatti-28273856/" target="_blank" rel="noreferrer">LinkedIn Profile</a>
                            </div>
                        </div>
                    </div>
                    
                    {/* <div className="contact-form">
                        <h2>Send us a Message</h2>
                        {formSubmitted ? (
                            <div className="form-success">
                                <p>Thank you for your message! We'll get back to you soon.</p>
                                <button onClick={() => setFormSubmitted(false)}>Send Another Message</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="name">Name</label>
                                    <input 
                                        type="text" 
                                        id="name" 
                                        name="name" 
                                        value={formData.name} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input 
                                        type="email" 
                                        id="email" 
                                        name="email" 
                                        value={formData.email} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="message">Message</label>
                                    <textarea 
                                        id="message" 
                                        name="message" 
                                        value={formData.message} 
                                        onChange={handleChange} 
                                        required 
                                        rows="5"
                                    ></textarea>
                                </div>
                                <button type="submit">Send Message</button>
                            </form>
                        )}
                    </div> */}
                </div>
            </div>
        </div>
    )
}
