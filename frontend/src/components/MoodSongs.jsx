


import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import "./MoodSongs.css";

const MoodSongs = ({ songs = [] }) => {
  console.log("Songs received:", songs);

  const [isPlaying, setIsPlaying] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRefs = useRef([]);

  const handlePlayPause = async (index) => {
    const currentAudio = audioRefs.current[index];

    if (!currentAudio) return;

    if (isPlaying === index) {
      currentAudio.pause();
      setIsPlaying(null);
      return;
    }

    if (isPlaying !== null && audioRefs.current[isPlaying]) {
      audioRefs.current[isPlaying].pause();
      audioRefs.current[isPlaying].currentTime = 0;
    }

    try {
      await currentAudio.play();
      setIsPlaying(index);
    } catch (err) {
      console.log(err);
    }
  };

  const skipForward = () => {
    if (isPlaying === null) return;
    audioRefs.current[isPlaying].currentTime += 10;
  };

  const skipBackward = () => {
    if (isPlaying === null) return;
    audioRefs.current[isPlaying].currentTime -= 10;
  };

  const handleSeek = (e) => {
    if (isPlaying === null) return;

    const width = e.currentTarget.clientWidth;
    const click = e.nativeEvent.offsetX;

    audioRefs.current[isPlaying].currentTime =
      (click / width) * audioRefs.current[isPlaying].duration;
  };

  return (
    <div className="mood-songs">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🎵 Recommended Songs
      </motion.h2>

      {songs.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            color: "white",
            marginTop: "40px",
            fontSize: "22px",
          }}
        >
          No songs found for this mood 😔
        </div>
      ) : (
        songs.map((song, index) => (
          <motion.div
            key={song._id || index}
            className={`song ${
              isPlaying === index ? "active-song" : ""
            }`}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="song-left">
              <img
                className="song-image"
                src={
                  song.image ||
                  `https://picsum.photos/300?random=${index}`
                }
                alt={song.title}
              />

              <div className="title">
                <h3>{song.title}</h3>
                <p>{song.artist}</p>
              </div>
            </div>

            <div className="play-pause-button">
              <audio
                ref={(el) => (audioRefs.current[index] = el)}
                src={song.audio}
                preload="auto"
                style={{ display: "none" }}
                onTimeUpdate={(e) =>
                  setCurrentTime(e.target.currentTime)
                }
                onLoadedMetadata={(e) =>
                  setDuration(e.target.duration)
                }
                onEnded={() => {
                  setIsPlaying(null);
                  setCurrentTime(0);
                }}
              />

              <button
                onClick={() => handlePlayPause(index)}
              >
                {isPlaying === index ? "⏸️" : "▶️"}
              </button>
            </div>
          </motion.div>
        ))
      )}

      {isPlaying !== null && (
        <div className="floating-player">
          <div className="player-left">
            <img
              className="player-image"
              src={
                songs[isPlaying].image ||
                `https://picsum.photos/300?random=${isPlaying}`
              }
              alt={songs[isPlaying].title}
            />

            <div className="player-info">
              <h3>{songs[isPlaying].title}</h3>
              <p>{songs[isPlaying].artist}</p>
            </div>
          </div>

          <div className="player-center">
            <div className="player-controls">
              <button onClick={skipBackward}>⏪ 10s</button>

              <button
                onClick={() => handlePlayPause(isPlaying)}
              >
                ⏸️
              </button>

              <button onClick={skipForward}>10s ⏩</button>
            </div>

            <div className="progress-container">
              <span>
                {Math.floor(currentTime / 60)}:
                {String(Math.floor(currentTime % 60)).padStart(
                  2,
                  "0"
                )}
              </span>

              <div
                className="progress-bar"
                onClick={handleSeek}
              >
                <div
                  className="progress"
                  style={{
                    width: `${
                      duration
                        ? (currentTime / duration) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>

              <span>
                {Math.floor(duration / 60)}:
                {String(Math.floor(duration % 60)).padStart(
                  2,
                  "0"
                )}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodSongs;
