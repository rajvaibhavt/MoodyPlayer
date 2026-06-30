import mongoose from 'mongoose';

const songSchema = new mongoose.Schema({
  title: String,
  artist: String,
  audio: String,
  mood: String,
});

const Song = mongoose.models.Song || mongoose.model('Song', songSchema);

export default Song;
