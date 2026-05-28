
import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import axios from 'axios';

const FaceExpressionDetector = ({ setSongs }) => {

  const videoRef = useRef();

  const [currentMood, setCurrentMood] = useState("Ready");
  const [loading, setLoading] = useState(false);

 

  const startVideo = () => {

    navigator.mediaDevices
      .getUserMedia({ video: true })

      .then((stream) => {

        videoRef.current.srcObject = stream;

      })

      .catch((err) => {

        console.log(err);
      });
  };

  // FETCH SONGS

  const fetchSongs = async (mood) => {

    try {

      const response = await axios.get(
        `http://localhost:3000/songs?mood=${mood}`
      );

      setSongs(response.data.songs);

    } catch (error) {

      console.log(error);
    }
  };

  // DETECT MOOD

  const detectMood = async () => {

    try {

      setLoading(true);

      const detections = await faceapi
        .detectSingleFace(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions()
        )
        .withFaceExpressions();

      if (detections) {

        const expressions = detections.expressions;

        const mood = Object.keys(expressions).reduce((a, b) =>
          expressions[a] > expressions[b] ? a : b
        );

        setCurrentMood(mood);

        console.log("Detected Mood:", mood);

        await fetchSongs(mood);

      } else {

        setCurrentMood("No Face");
      }

      setLoading(false);

    } catch (error) {

      console.log(error);

      setLoading(false);
    }
  };

 

  const getMoodEmoji = (mood) => {

    switch (mood) {

      case "happy":
        return "😄";

      case "sad":
        return "😢";

      case "angry":
        return "😡";

      case "surprised":
        return "😲";

      case "fearful":
        return "😨";

      case "disgusted":
        return "🤢";

      case "neutral":
        return "😐";

      case "No Face":
        return "🚫";

      default:
        return "🎵";
    }
  };

  

  useEffect(() => {

    const loadModels = async () => {

      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');

      await faceapi.nets.faceExpressionNet.loadFromUri('/models');

      console.log("Models Loaded");

      startVideo();
    };

    loadModels();

  }, []);

  return (

    <div className="face-detection-container">

      

      <div className="live-status">

        <div className="live-dot"></div>

        LIVE AI

      </div>

      

      <video
        ref={videoRef}
        autoPlay
        muted
        className="video"
      />


      <h2 className="mood-text">

        {loading
          ? "🎵 Detecting..."
          : `${getMoodEmoji(currentMood)} ${currentMood}`
        }

      </h2>

  

      <button
        className="detect-btn"
        onClick={detectMood}
      >
        Detect Mood
      </button>

    </div>
  );
};

export default FaceExpressionDetector;