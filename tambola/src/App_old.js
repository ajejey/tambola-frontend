import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';

import CreateRoom from './oldComponents/CreateRoom/CreateRoom';
import Home from './oldComponents/Home/Home';
import JoinRoom from './oldComponents/JoinRoom/JoinRoom';
import GameRoom from './oldComponents/GameRoom/GameRoom';
import PrivacyPolicy from './oldComponents/PrivacyPolicy/PrivacyPolicy';
import TermsOfService from './oldComponents/TermsOfService/TermsOfService';
import AboutUs from './oldComponents/AboutUs/AboutUs';
import Contact from './oldComponents/Contact/Contact';
import FAQ from './oldComponents/FAQ/FAQ';
import Blog from './oldComponents/Blog/Blog';
import BlogPost from './oldComponents/Blog/BlogPost';
import ReactGA from "react-ga4";


function App() {
  ReactGA.initialize("G-HRZVY37W6Q");
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-room" element={<CreateRoom />} />
        <Route path="/join-room" element={<JoinRoom />} />
        <Route path="/game-room" element={<GameRoom />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:postId" element={<BlogPost />} />
      </Routes>
    </div>
  );
}

export default App;
