import fs from 'fs';
import mongoose from 'mongoose';
import { IncomingForm } from 'formidable';
import ImageKit from 'imagekit';
import connectToDatabase from './_db.js';
import Song from './models/song.model.js';

function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({ keepExtensions: true, multiples: false });

    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err);
      }
      resolve({ fields, files });
    });
  });
}

export default async function handler(req, res) {
  try {
    await connectToDatabase();
  } catch (error) {
    console.error('DB connection failed:', error);
    return res.status(500).json({
      message: 'Unable to connect to database',
      error: error.message,
    });
  }

  if (req.method === 'GET') {
    const { mood } = req.query;

    if (!mood) {
      return res.status(400).json({ message: 'Missing mood query parameter' });
    }

    try {
      const songs = await Song.find({ mood });
      return res.status(200).json({ songs });
    } catch (error) {
      console.error('Failed to fetch songs:', error);
      return res.status(500).json({
        message: 'Failed to fetch songs',
        error: error.message,
      });
    }
  }

  if (req.method === 'POST') {
    try {
      const { fields, files } = await parseForm(req);

      const { title, artist, mood } = fields;
      const audioFile = files?.audio;

      if (!title || !artist || !mood || !audioFile) {
        return res.status(400).json({
          message: 'Missing required fields: title, artist, mood, audio',
        });
      }

      const imagekit = new ImageKit({
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
        urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
      });

      const fileStream = fs.createReadStream(audioFile.filepath);
      const uploadResult = await imagekit.upload({
        file: fileStream,
        fileName: new mongoose.Types.ObjectId().toString(),
        folder: 'audio-files',
      });

      const song = await Song.create({
        title,
        artist,
        mood,
        audio: uploadResult.url,
      });

      return res.status(201).json({ message: 'Song added successfully', song });
    } catch (error) {
      console.error('Failed to upload song:', error);
      return res.status(500).json({
        message: 'Failed to upload song',
        error: error.message,
      });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
