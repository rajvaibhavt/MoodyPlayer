
import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import axios from "axios";

const FaceExpressionDetector = ({ setSongs, setCurrentMood }) => {
  const videoRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [detectedMood, setDetectedMood] = useState("Ready");

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.log("Camera Error:", err);
    }
  };

  const loadModels = async () => {
    try {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceExpressionNet.loadFromUri("/models");

      console.log("FaceAPI Models Loaded");

      startVideo();
    } catch (err) {
      console.log("Model Loading Error:", err);
    }
  };

  useEffect(() => {
    loadModels();

    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, []);

  const fetchSongs = async (mood) => {
    try {
      console.log("Fetching songs for:", mood);

      const response = await axios.get(
        `https://moodyplayer-g138.onrender.com/songs?mood=${encodeURIComponent(
          mood
        )}`
      );

      console.log("Backend Response:", response.data);

      if (response.data.songs) {
        setSongs(response.data.songs);
      } else {
        setSongs([]);
      }
    } catch (err) {
      console.log("Song Fetch Error:", err);
      setSongs([]);
    }
  };

  const detectMood = async () => {
    if (!videoRef.current) return;

    setLoading(true);

    try {
      const detection = await faceapi
        .detectSingleFace(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions()
        )
        .withFaceExpressions();

      if (!detection) {
        setDetectedMood("No Face");
        setLoading(false);
        return;
      }

      const expressions = detection.expressions;

      console.log("Expressions:", expressions);

      const mood = Object.keys(expressions).reduce((a, b) =>
        expressions[a] > expressions[b] ? a : b
      );

      const moodMap = {
        happy: "happy",
        sad: "sad",
        angry: "angry",
        neutral: "neutral",
        surprised: "surprised",
        fearful: "fearful",
        disgusted: "disgusted",
      };

      const finalMood = moodMap[mood] || "neutral";

      console.log("Detected:", mood);
      console.log("Database Mood:", finalMood);

      setDetectedMood(finalMood);

      if (setCurrentMood) {
        setCurrentMood(finalMood);
      }

      await fetchSongs(finalMood);

      setLoading(false);
    } catch (err) {
      console.log("Mood Detection Error:", err);
      setLoading(false);
    }
  };

  const getEmoji = (mood) => {
    switch (mood) {
      case "happy":
        return "😄";
      case "sad":
        return "😢";
      case "angry":
        return "😡";
      case "neutral":
        return "😐";
      case "surprised":
        return "😲";
      case "fearful":
        return "😨";
      case "disgusted":
        return "🤢";
      case "No Face":
        return "🚫";
      default:
        return "🎵";
    }
  };

  return (
    <div className="face-expression-detector">
      <div className="live-ai">
        <span>●</span> LIVE AI
      </div>

      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="video"
      />

      <h2 className="mood-text">
        {loading
          ? "🎵 Detecting..."
          : `${getEmoji(detectedMood)} ${detectedMood}`}
      </h2>

      <button
        className="detect-btn"
        onClick={detectMood}
        disabled={loading}
      >
        {loading ? "Detecting..." : "Detect Mood"}
      </button>
    </div>
  );
};

export default FaceExpressionDetector;