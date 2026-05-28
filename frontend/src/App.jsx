import { useState } from 'react';

import './App.css';

import FaceExpressionDetector from './components/FaceExpressionDetector';

import MoodSongs from './components/MoodSongs';

function App() {

  const [songs, setSongs] = useState([]);

  // CURRENT MOOD

  const [currentMood, setCurrentMood] = useState("neutral");

  return (

    <div className="main-layout">

      {/* SIDEBAR */}

      <div className="sidebar">

        <h1 className="logo">🎵 Moody</h1>

        <div className="menu">

          <div className="menu-item active">

            <i className="ri-home-5-fill"></i>

            <span>Home</span>

          </div>

          <div className="menu-item">

            <i className="ri-music-2-fill"></i>

            <span>Library</span>

          </div>

          <div className="menu-item">

            <i className="ri-heart-fill"></i>

            <span>Favorites</span>

          </div>

        </div>

      </div>

      {/* CONTENT */}

      <div className="content">

        {/* MOOD BACKGROUND */}

        <div className={`mood-background ${currentMood}`}></div>

        {/* FLOATING ORB */}

        <div className="floating-orb"></div>

        {/* TOP SECTION */}

        <div className="top-section">

          {/* LEFT */}

          <div className="left-section">

            <h1 className="main-title">

              AI Mood Music Player

            </h1>

            <p className="subtitle">

              Detect your mood and play matching songs instantly.

            </p>

          </div>

          {/* CAMERA */}

          <div className="camera-wrapper">

            <FaceExpressionDetector

              setSongs={setSongs}

              setCurrentMood={setCurrentMood}

            />

          </div>

        </div>

        {/* SONGS */}

        <MoodSongs songs={songs} />

      </div>

    </div>
  );
}

export default App;