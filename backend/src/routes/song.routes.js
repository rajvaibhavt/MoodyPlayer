const express = require('express');
const router = express.Router();
const multer = require('multer');
const uploadToImageKit = require('../service/storage.service');
const  SongModel = require('../models/song.model');

const upload = multer({storage: multer.memoryStorage()});

router.post('/songs', upload.single('audio'), async(req, res) => {

    console.log(req.body);
 
    console.log(req.file);
    const filedata = await uploadToImageKit(req.file);
    console.log(filedata);

    const song = await SongModel.create({
        title:req.body.title,
        artist:req.body.artist,
        audio:filedata.url,
        mood:req.body.mood,
    });

    res.status(201).json({
        message: 'Song added successfully',
        song: song,
    });
});

router.get('/songs', async(req, res) => {
    const {mood} = req.query;
    const song = await SongModel.find({
        mood: mood,
    });
    res.status(200).json({
        message: 'Songs retrieved successfully',
        songs: song,
    });
});

module.exports = router;

