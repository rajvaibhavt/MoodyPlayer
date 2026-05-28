import React, { useRef, useState } from 'react';

import { motion } from 'framer-motion';

import './MoodSongs.css';

const MoodSongs = ({ songs }) => {

  const [isPlaying, setIsPlaying] = useState(null);

  const [currentTime, setCurrentTime] = useState(0);

  const [duration, setDuration] = useState(0);

  const audioRefs = useRef([]);

  

  const handlePlayPause = async (index, song) => {

    const currentAudio = audioRefs.current[index];

    

    if (isPlaying === index) {

      currentAudio.pause();

      setIsPlaying(null);

    } else {

    

      if (isPlaying !== null) {

        audioRefs.current[isPlaying].pause();

        audioRefs.current[isPlaying].currentTime = 0;
      }

      try {

        await currentAudio.play();

        currentAudio.volume = 1;

        setIsPlaying(index);

      } catch (error) {

        console.log("Audio Play Error:", error);
      }
    }
  };

  // SEEK

  const handleSeek = (e) => {

    if (isPlaying === null) return;

    const progressBar = e.currentTarget;

    const clickX = e.nativeEvent.offsetX;

    const width = progressBar.clientWidth;

    const duration = audioRefs.current[isPlaying].duration;

    audioRefs.current[isPlaying].currentTime =
      (clickX / width) * duration;
  };

  // SKIP FORWARD

  const skipForward = () => {

    if (isPlaying === null) return;

    audioRefs.current[isPlaying].currentTime += 10;
  };

  // SKIP BACKWARD

  const skipBackward = () => {

    if (isPlaying === null) return;

    audioRefs.current[isPlaying].currentTime -= 10;
  };

  return (

    <div className='mood-songs'>

      {/* TITLE */}

      <motion.h2

        initial={{
          opacity: 0,
          y: -20
        }}

        animate={{
          opacity: 1,
          y: 0
        }}

        transition={{
          duration: 0.5
        }}

      >
        🎵 Recommended Songs
      </motion.h2>

      {/* SONGS */}

      {Array.isArray(songs) && songs.map((song, index) => (

        <motion.div

          className={`song ${isPlaying === index ? 'active-song' : ''}`}

          key={index}

          initial={{
            opacity: 0,
            y: 40,
            scale: 0.95
          }}

          animate={{
            opacity: 1,
            y: 0,
            scale: 1
          }}

          transition={{
            duration: 0.4,
            delay: index * 0.1
          }}

          whileHover={{
            scale: 1.02,
            y: -8
          }}

        >

          {/* LEFT */}

          <div className='song-left'>

            <motion.img

              whileHover={{
                rotate: 5,
                scale: 1.08
              }}

              transition={{
                duration: 0.3
              }}

              src={
                song.image ||

                `https://picsum.photos/300?random=${index}`
              }

              alt={song.title}

              className='song-image'
            />

            <div className='title'>

              <h3>{song.title}</h3>

              <p>{song.artist}</p>

            </div>

          </div>

          {/* RIGHT */}

          <div className='play-pause-button'>

            <audio

              ref={(el) => {

                if (el) {

                  el.volume = 1;

                  audioRefs.current[index] = el;
                }
              }}

              src={song.audio}

              preload="auto"

              style={{ display: "none" }}

              onTimeUpdate={(e) => {

                setCurrentTime(e.target.currentTime);
              }}

              onLoadedMetadata={(e) => {

                setDuration(e.target.duration);
              }}

              onEnded={() => {

                setIsPlaying(null);

                setCurrentTime(0);
              }}
            />

            {/* PLAY BUTTON */}

            <motion.button

              whileTap={{
                scale: 0.9
              }}

              whileHover={{
                scale: 1.1
              }}

              onClick={() => handlePlayPause(index, song)}
            >

              {isPlaying === index ? (

                <i className='ri-pause-line'></i>

              ) : (

                <i className='ri-play-circle-fill'></i>
              )}

            </motion.button>

            {/* WAVE */}

            {isPlaying === index && (

              <motion.div

                className="wave"

                initial={{
                  opacity: 0
                }}

                animate={{
                  opacity: 1
                }}

              >

                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>

              </motion.div>
            )}

          </div>

        </motion.div>

      ))}

      {/* FLOATING PLAYER */}

      {isPlaying !== null && (

        <motion.div

          className="floating-player"

          initial={{
            y: 100,
            opacity: 0
          }}

          animate={{
            y: 0,
            opacity: 1
          }}

          transition={{
            duration: 0.4
          }}

        >

          {/* LEFT */}

          <div className="player-left">

            <img

              src={
                songs[isPlaying]?.image ||

                `https://picsum.photos/300?random=${isPlaying}`
              }

              alt={songs[isPlaying]?.title}

              className="player-image"
            />

            <div className="player-info">

              <h3>

                {songs[isPlaying]?.title}

              </h3>

              <p>

                {songs[isPlaying]?.artist}

              </p>

            </div>

          </div>

          {/* CENTER */}

          <div className="player-center">

            {/* CONTROLS */}

            <div className="player-controls">

              {/* BACKWARD */}

              <motion.button

                className="control-btn"

                whileHover={{
                  scale: 1.1
                }}

                whileTap={{
                  scale: 0.9
                }}

                onClick={skipBackward}
              >

                <i className="ri-replay-10-fill"></i>

              </motion.button>

              {/* PLAY / PAUSE */}

              <motion.button

                className="player-btn"

                whileHover={{
                  scale: 1.08
                }}

                whileTap={{
                  scale: 0.9
                }}

                onClick={() =>
                  handlePlayPause(
                    isPlaying,
                    songs[isPlaying]
                  )
                }
              >

                {isPlaying !== null ? (

                  <i className="ri-pause-fill"></i>

                ) : (

                  <i className="ri-play-fill"></i>
                )}

              </motion.button>

              {/* FORWARD */}

              <motion.button

                className="control-btn"

                whileHover={{
                  scale: 1.1
                }}

                whileTap={{
                  scale: 0.9
                }}

                onClick={skipForward}
              >

                <i className="ri-forward-10-fill"></i>

              </motion.button>

            </div>

            {/* PROGRESS */}

            <div className="progress-container">

              {/* CURRENT TIME */}

              <span>

                {Math.floor(currentTime / 60)}:

                {String(
                  Math.floor(currentTime % 60)
                ).padStart(2, "0")}

              </span>

              {/* PROGRESS BAR */}

              <div

                className="progress-bar"

                onClick={handleSeek}
              >

                <div

                  className="progress"

                  style={{
                    width: `${(currentTime / duration) * 100}%`
                  }}
                ></div>

              </div>

              {/* DURATION */}

              <span>

                {Math.floor(duration / 60)}:

                {String(
                  Math.floor(duration % 60)
                ).padStart(2, "0")}

              </span>

            </div>

          </div>

          {/* RIGHT */}

          <div className="player-wave">

            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>

          </div>

        </motion.div>
      )}

    </div>
  );
};

export default MoodSongs;