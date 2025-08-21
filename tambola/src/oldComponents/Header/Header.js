import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './Header.css'

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false)

    const toggleMenu = () => {
        setMenuOpen(!menuOpen)
    }

    const closeMenu = () => {
        setMenuOpen(false)
    }

    return (
        <header className="main-header">
            <div className="header-container">
                <Link to="/" className="logo" onClick={closeMenu}>
                    TAMBOLA
                </Link>

                <div className={`mobile-menu-button ${menuOpen ? 'active' : ''}`} onClick={toggleMenu}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

                <nav className={`nav-menu ${menuOpen ? 'active' : ''}`}>
                    <ul>
                        <li><Link to="/" onClick={closeMenu}>Home</Link></li>
                        <li><Link to="/about" onClick={closeMenu}>About Us</Link></li>
                        <li><Link to="/contact" onClick={closeMenu}>Contact</Link></li>
                        <li><Link to="/faq" onClick={closeMenu}>FAQ</Link></li>
                        <li><Link to="/blog" onClick={closeMenu}>Blog</Link></li>
                        <li><Link to="/more-games" onClick={closeMenu}>More Games</Link></li>
                        {/* <li><Link to="/privacy-policy" onClick={closeMenu}>Privacy Policy</Link></li>
                        <li><Link to="/terms-of-service" onClick={closeMenu}>Terms of Service</Link></li> */}
                    </ul>
                </nav>
            </div>
        </header>
    )
}
