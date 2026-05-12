import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

export default function FaceExpressionDetector() {
  const videoRef = useRef(null);
  const intervalRef = useRef(null);

  const [expression, setExpression] = useState("Detecting...");

  useEffect(() => {
    loadModels();

    // cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const loadModels = async () => {
    const MODEL_URL = "/models";

    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);

    startVideo();
  };

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  const handleVideoPlay = () => {
    intervalRef.current = setInterval(async () => {
      if (!videoRef.current) return;

      const detection = await faceapi
        .detectSingleFace(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions()
        )
        .withFaceExpressions();

      console.log(detection);

      // FIXED CONDITION
      if (detection && detection.expressions) {
        const expressions = detection.expressions;

        const maxExpression = Object.keys(expressions).reduce((a, b) =>
          expressions[a] > expressions[b] ? a : b
        );

        setExpression(maxExpression);
      } else {
        setExpression("No face detected");
      }
    }, 500);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Facial Expression Detection</h2>

      <video
        ref={videoRef}
        autoPlay
        muted
        width="500"
        height="400"
        onPlay={handleVideoPlay}
        style={{ border: "2px solid black" }}
      />

      <h3>Expression: {expression}</h3>
    </div>
  );
}