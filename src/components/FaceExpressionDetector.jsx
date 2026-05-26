import React, { useEffect, useRef } from "react";
import * as faceapi from "face-api.js";
import "./facialExpression.css";

export default function FacialExpression() {

  const videoRef = useRef();

  // Load models and start camera
  useEffect(() => {

    const loadModels = async () => {

      const MODEL_URL = "/models";

      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);

      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);

      console.log("Models Loaded");
    };

    const startVideo = async () => {

      try {

        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        videoRef.current.srcObject = stream;

      } catch (err) {

        console.error("Error accessing webcam:", err);
      }
    };

    loadModels();
    startVideo();

  }, []);


  const detectMood = async () => {

    const detections = await faceapi
      .detectAllFaces(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions()
      )
      .withFaceExpressions();

    // No face detected
    if (!detections || detections.length === 0) {

      console.log("No faces detected");
      return;
    }

    let mostProbableExpression = 0;
    let detectedExpression = "";

    // Find highest expression value
    for (const expression of Object.keys(
      detections[0].expressions
    )) {

      if (
        detections[0].expressions[expression] >
        mostProbableExpression
      ) {

        mostProbableExpression =
          detections[0].expressions[expression];

        detectedExpression = expression;
      }
    }

    console.log("Detected Mood:", detectedExpression);
  };

  return (

    <div className="facial-expression-detector">

      <video
        ref={videoRef}
        autoPlay
        muted
        className="user-video-feed"
      />

      <button onClick={detectMood}>
        Mood Detection
      </button>

    </div>
  );
}