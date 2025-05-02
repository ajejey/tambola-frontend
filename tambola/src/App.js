import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';

import CreateRoom from './components/CreateRoom/CreateRoom';
import Home from './components/Home/Home';
import JoinRoom from './components/JoinRoom/JoinRoom';
import GameRoom from './components/GameRoom/GameRoom';
import PrivacyPolicy from './components/PrivacyPolicy/PrivacyPolicy';
import TermsOfService from './components/TermsOfService/TermsOfService';
import AboutUs from './components/AboutUs/AboutUs';
import Contact from './components/Contact/Contact';
import FAQ from './components/FAQ/FAQ';
import Blog from './components/Blog/Blog';
import BlogPost from './components/Blog/BlogPost';

function App() {
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
