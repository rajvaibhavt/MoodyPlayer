import { useState } from 'react'

import './App.css'
import FaceExpressionDetector from './components/FaceExpressionDetector'
import MoodSongs from './components/MoodSongs'

function App() {
  

  return (
    <>
    <FaceExpressionDetector/>
    <MoodSongs/>
    </>
  )
}

export default App
