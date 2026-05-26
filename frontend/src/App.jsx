import { useState } from 'react'

import './App.css'
import FaceExpressionDetector from './components/FaceExpressionDetector'
import MoodSongs from './components/MoodSongs'

function App() {
  
 const [songs, setSongs] = useState([   
      {
        title: "test-title",
        artist: "test-artist",
        url: "test-url"
      },
      {
        title: "test-title",
        artist: "test-artist",
        url: "test-url"
      },
      {
        title: "test-title",
        artist: "test-artist",
        url: "test-url"
      },
     

    ]);

  return (
    <>
    <FaceExpressionDetector setSongs={setSongs}/>
    <MoodSongs songs={songs}/>
    </>
  )
}

export default App
