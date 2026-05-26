


import React, { useRef, useState } from 'react';
import './MoodSongs.css';

const MoodSongs = ({ songs }) => {

  const [isPlaying, setIsPlaying] = useState(null);

  // Store audio refs
  const audioRefs = useRef([]);

  const handlePlayPause = async (index) => {

    const currentAudio = audioRefs.current[index];

    // If same song is playing -> pause it
    if (isPlaying === index) {

      currentAudio.pause();

      setIsPlaying(null);

    } 
    
    else {

      // Pause previous song
      if (isPlaying !== null) {

        audioRefs.current[isPlaying].pause();

        audioRefs.current[isPlaying].currentTime = 0;
      }

      try {

        await currentAudio.play();

        setIsPlaying(index);

      } catch (error) {

        console.log("Audio Play Error:", error);
      }
    }
  };

  return (

    <div className='mood-songs'>

      <h2>Recommended Songs</h2>

      {Array.isArray(songs) && songs.map((song, index) => (

        <div className='song' key={index}>

          <div className='title'>

            <h3>{song.title}</h3>

            <p>{song.artist}</p>

          </div>

          <div className='play-pause-button'>

            <audio
              ref={(el) => (audioRefs.current[index] = el)}
              src={song.audio}
              preload="auto"
              style={{ display: "none" }}
              onEnded={() => setIsPlaying(null)}
            />

            <button onClick={() => handlePlayPause(index)}>

              {isPlaying === index ? (
                <i className='ri-pause-line'></i>
              ) : (
                <i className='ri-play-circle-fill'></i>
              )}

            </button>

          </div>

        </div>

      ))}

    </div>
  );
};

export default MoodSongs;