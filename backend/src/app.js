const express = require('express');
const songRoutes = require('./routes/song.routes');
const cors = require('cors');
require('./db/db');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('MoodyPlayer Backend is working!');
});

app.use('/', songRoutes);

module.exports = app;